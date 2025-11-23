import React, { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

// Configuration
const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

interface PeerConnection {
  pc: RTCPeerConnection;
  stream?: MediaStream;
}

interface VideoCallProps {
  classroomId: string;
  serverUrl?: string;
  onError?: (error: string) => void;
  onUserJoined?: (userId: string) => void;
  onUserLeft?: (userId: string) => void;
}

const VideoCallComponent: React.FC<VideoCallProps> = ({
  classroomId,
  serverUrl = 'http://localhost:5000',
  onError,
  onUserJoined,
  onUserLeft
}) => {
  // Refs
  const socketRef = useRef<Socket | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Map<string, PeerConnection>>(new Map());
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // State
  const [isInCall, setIsInCall] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [remoteUsers, setRemoteUsers] = useState<Map<string, MediaStream>>(new Map());
  const [connectionStatus, setConnectionStatus] = useState<string>('Not connected');

  // Initialize Socket.IO
  const initSocket = useCallback(() => {
    const socket = io(serverUrl, {
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('Connected to server:', socket.id);
      setConnectionStatus('Connected');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnectionStatus('Disconnected');
    });

    // Handle existing users
    socket.on('existing-users', async (users: string[]) => {
      console.log('Existing users:', users);
      for (const userId of users) {
        await createPeerConnection(userId, true);
      }
    });

    // Handle new user joining
    socket.on('user-joined', async ({ userId }: { userId: string }) => {
      console.log('User joined:', userId);
      onUserJoined?.(userId);
      await createPeerConnection(userId, false);
    });

    // Handle WebRTC offer
    socket.on('webrtc-offer', async ({ offer, from }: { offer: RTCSessionDescriptionInit; from: string }) => {
      console.log('Received offer from:', from);
      
      let peerData = peerConnectionsRef.current.get(from);
      if (!peerData) {
        peerData = await createPeerConnection(from, false);
      }

      try {
        await peerData.pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerData.pc.createAnswer();
        await peerData.pc.setLocalDescription(answer);

        socket.emit('webrtc-answer', {
          classroomId,
          answer,
          from: socket.id,
          to: from
        });
      } catch (error: any) {
        console.error('Error handling offer:', error);
        onError?.('Error handling offer: ' + error.message);
      }
    });

    // Handle WebRTC answer
    socket.on('webrtc-answer', async ({ answer, from }: { answer: RTCSessionDescriptionInit; from: string }) => {
      console.log('Received answer from:', from);
      
      const peerData = peerConnectionsRef.current.get(from);
      if (peerData) {
        try {
          await peerData.pc.setRemoteDescription(new RTCSessionDescription(answer));
        } catch (error: any) {
          console.error('Error handling answer:', error);
          onError?.('Error handling answer: ' + error.message);
        }
      }
    });

    // Handle ICE candidate
    socket.on('webrtc-candidate', async ({ candidate, from }: { candidate: RTCIceCandidateInit; from: string }) => {
      console.log('Received ICE candidate from:', from);
      
      const peerData = peerConnectionsRef.current.get(from);
      if (peerData) {
        try {
          await peerData.pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (error) {
          console.error('Error adding ICE candidate:', error);
        }
      }
    });

    // Handle user leaving
    socket.on('user-left', ({ userId }: { userId: string }) => {
      console.log('User left:', userId);
      onUserLeft?.(userId);
      removeUser(userId);
    });

    socketRef.current = socket;
    return socket;
  }, [serverUrl, classroomId, onError, onUserJoined, onUserLeft]);

  // Create peer connection
  const createPeerConnection = useCallback(async (userId: string, createOffer: boolean): Promise<PeerConnection> => {
    console.log(`Creating peer connection for ${userId}, createOffer: ${createOffer}`);
    
    const pc = new RTCPeerConnection(ICE_SERVERS);
    const peerData: PeerConnection = { pc };
    peerConnectionsRef.current.set(userId, peerData);

    // Add local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    // Handle incoming remote stream
    pc.ontrack = (event) => {
      console.log('Received remote track from:', userId);
      const stream = event.streams[0];
      peerData.stream = stream;
      
      setRemoteUsers(prev => {
        const newMap = new Map(prev);
        newMap.set(userId, stream);
        return newMap;
      });
    };

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit('webrtc-candidate', {
          classroomId,
          candidate: event.candidate,
          from: socketRef.current.id,
          to: userId
        });
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${userId}:`, pc.connectionState);
      
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        removeUser(userId);
      }
    };

    // Create and send offer if needed
    if (createOffer && socketRef.current) {
      try {
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socketRef.current.emit('webrtc-offer', {
          classroomId,
          offer,
          from: socketRef.current.id,
          to: userId
        });
      } catch (error: any) {
        console.error('Error creating offer:', error);
        onError?.('Error creating offer: ' + error.message);
      }
    }

    return peerData;
  }, [classroomId, onError]);

  // Remove user
  const removeUser = useCallback((userId: string) => {
    const peerData = peerConnectionsRef.current.get(userId);
    if (peerData) {
      peerData.pc.close();
      peerConnectionsRef.current.delete(userId);
    }

    setRemoteUsers(prev => {
      const newMap = new Map(prev);
      newMap.delete(userId);
      return newMap;
    });
  }, []);

  // Join call
  const joinCall = useCallback(async () => {
    try {
      setConnectionStatus('Requesting media...');
      
      // Get local media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      localStreamRef.current = stream;
      
      // Set local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setConnectionStatus('Connecting to server...');

      // Initialize socket
      const socket = initSocket();

      // Wait for connection
      await new Promise<void>((resolve) => {
        if (socket.connected) {
          resolve();
        } else {
          socket.once('connect', () => resolve());
        }
      });

      // Join classroom
      socket.emit('join-video-call', classroomId);
      
      setIsInCall(true);
      setConnectionStatus('In call');

    } catch (error: any) {
      console.error('Error joining call:', error);
      onError?.('Failed to join call: ' + error.message);
      setConnectionStatus('Error: ' + error.message);
    }
  }, [classroomId, initSocket, onError]);

  // Leave call
  const leaveCall = useCallback(() => {
    if (socketRef.current && classroomId) {
      socketRef.current.emit('leave-video-call', classroomId);
    }

    // Close all peer connections
    peerConnectionsRef.current.forEach((peerData) => {
      peerData.pc.close();
    });
    peerConnectionsRef.current.clear();

    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Disconnect socket
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }

    setRemoteUsers(new Map());
    setIsInCall(false);
    setConnectionStatus('Not connected');
  }, [classroomId]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  }, []);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      leaveCall();
    };
  }, [leaveCall]);

  return (
    <div className="video-call-container">
      {/* Controls */}
      <div className="controls-bar">
        <div className="status">
          Status: {connectionStatus}
        </div>
        <div className="buttons">
          {!isInCall ? (
            <button onClick={joinCall} className="btn-join">
              Join Call
            </button>
          ) : (
            <>
              <button onClick={leaveCall} className="btn-leave">
                Leave Call
              </button>
              <button onClick={toggleVideo} className={`btn-toggle ${!isVideoEnabled ? 'disabled' : ''}`}>
                {isVideoEnabled ? '📹 Video On' : '📹 Video Off'}
              </button>
              <button onClick={toggleAudio} className={`btn-toggle ${!isAudioEnabled ? 'disabled' : ''}`}>
                {isAudioEnabled ? '🎤 Mic On' : '🎤 Mic Off'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Video Grid */}
      <div className="video-grid">
        {/* Local Video */}
        {isInCall && (
          <div className="video-container local">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="video-element local-video"
            />
            <div className="video-label">You (Local)</div>
          </div>
        )}

        {/* Remote Videos */}
        {Array.from(remoteUsers.entries()).map(([userId, stream]) => (
          <RemoteVideo key={userId} userId={userId} stream={stream} />
        ))}
      </div>
    </div>
  );
};

// Remote Video Component
interface RemoteVideoProps {
  userId: string;
  stream: MediaStream;
}

const RemoteVideo: React.FC<RemoteVideoProps> = ({ userId, stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div className="video-container remote">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="video-element"
      />
      <div className="video-label">User {userId.substring(0, 8)}</div>
    </div>
  );
};

export default VideoCallComponent;
