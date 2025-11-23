# WebRTC Group Video Call - Complete Guide

## 🎯 Overview

This implementation provides a complete WebRTC-based group video calling system using Socket.IO for signaling. It supports:

- ✅ Multiple participants in a room
- ✅ Real-time P2P video/audio streaming
- ✅ Dynamic participant joining/leaving
- ✅ Modern, responsive UI
- ✅ Video/audio toggle controls

## 📁 Files Created

1. **video-call-demo.html** - Standalone HTML demo (no dependencies needed)
2. **VideoCallComponent.tsx** - React/TypeScript component
3. **VideoCallComponent.css** - Styles for the React component
4. **socket.ts** - Backend Socket.IO server (already exists)

## 🚀 Quick Start

### Option 1: HTML Demo (Fastest)

1. Make sure your backend server is running on `http://localhost:5000`
2. Open `http://localhost:5000/video-call-demo.html` in multiple browser tabs
3. Enter the same classroom ID in each tab
4. Click "Join Call" in each tab

### Option 2: React Component

1. Install dependencies in your frontend:
   ```bash
   npm install socket.io-client
   ```

2. Import the component:
   ```tsx
   import VideoCallComponent from './VideoCallComponent';
   import './VideoCallComponent.css';

   function ClassroomPage() {
     return (
       <VideoCallComponent
         classroomId="your-classroom-id"
         serverUrl="http://localhost:5000"
         onError={(error) => console.error(error)}
         onUserJoined={(userId) => console.log('User joined:', userId)}
         onUserLeft={(userId) => console.log('User left:', userId)}
       />
     );
   }
   ```

## 🔧 Backend Setup

Your backend (socket.ts) is already configured correctly! It handles:

1. **join-video-call** - User joins a classroom
2. **webrtc-offer** - Forward WebRTC offers
3. **webrtc-answer** - Forward WebRTC answers
4. **webrtc-candidate** - Forward ICE candidates
5. **leave-video-call** - User leaves
6. **disconnect** - Cleanup on disconnect

## 🎬 How It Works

### 1. Join Flow
```
User A joins room
  ↓
Server adds A to room
  ↓
Server sends existing users to A
  ↓
A creates peer connections with existing users
  ↓
A sends offers to all existing users
```

### 2. New User Flow
```
User B joins room (A already in)
  ↓
Server notifies A about B
  ↓
B receives list of existing users (A)
  ↓
B creates offer for A
  ↓
A receives offer, creates answer
  ↓
ICE candidates exchanged
  ↓
P2P connection established
```

### 3. Signaling Sequence
```
Peer A                  Server                  Peer B
  |                       |                       |
  |---join-video-call---->|                       |
  |                       |<--join-video-call-----|
  |                       |                       |
  |<--existing-users------|                       |
  |                       |---user-joined-------->|
  |                       |                       |
  |---webrtc-offer------->|---webrtc-offer------->|
  |                       |                       |
  |<--webrtc-answer-------|<--webrtc-answer-------|
  |                       |                       |
  |<--webrtc-candidate----|<--webrtc-candidate----|
  |                       |                       |
  |     P2P Connection Established                |
  |<==========================================>|
```

## 🐛 Troubleshooting

### Issue 1: "Cannot access camera/microphone"

**Cause:** Browser security or permissions

**Solutions:**
1. Use HTTPS or localhost (required for WebRTC)
2. Check browser permissions (should prompt automatically)
3. In Chrome: Settings → Privacy → Site Settings → Camera/Microphone
4. Make sure no other app is using the camera

### Issue 2: "Connected but no video/audio"

**Cause:** ICE candidate exchange failing or firewall issues

**Solutions:**
1. Check browser console for errors
2. Verify both peers can connect to STUN servers
3. Open browser console and check connection states
4. Try using a TURN server if behind strict firewall:
   ```javascript
   const ICE_SERVERS = {
     iceServers: [
       { urls: 'stun:stun.l.google.com:19302' },
       {
         urls: 'turn:your-turn-server.com:3478',
         username: 'user',
         credential: 'pass'
       }
     ]
   };
   ```

### Issue 3: "Socket.IO connection failed"

**Cause:** Backend not running or CORS issues

**Solutions:**
1. Verify backend is running: `npm run dev`
2. Check the server URL matches your backend
3. Verify CORS is configured in your backend:
   ```typescript
   // In app.ts or server setup
   import cors from 'cors';
   app.use(cors({
     origin: 'http://localhost:3000', // Your frontend URL
     credentials: true
   }));
   ```

### Issue 4: "Video works locally but not between different networks"

**Cause:** NAT traversal issues

**Solutions:**
1. Use TURN server (mandatory for production)
2. Configure TURN server in ICE_SERVERS
3. Popular TURN services:
   - Twilio STUN/TURN
   - xirsys.com
   - Self-hosted coturn

### Issue 5: "Only 2 users can connect, not more"

**Cause:** Mesh topology limitations

**Current:** Using mesh topology (each peer connects to every other peer)
- 2 users: 1 connection
- 3 users: 3 connections
- 4 users: 6 connections
- 5 users: 10 connections

**Solution for large groups:**
Use SFU (Selective Forwarding Unit) like:
- mediasoup
- Janus
- Jitsi

**Mesh is fine for:** 2-6 participants
**SFU recommended for:** 7+ participants

## 🔍 Testing Checklist

- [ ] Backend server running
- [ ] Socket.IO connected (check console)
- [ ] Camera/microphone permissions granted
- [ ] Local video visible
- [ ] Can join with same classroom ID in another tab
- [ ] Remote video appears
- [ ] Audio works both ways
- [ ] Toggle video on/off works
- [ ] Toggle audio on/off works
- [ ] Leaving call cleans up properly
- [ ] Joining after someone else works
- [ ] Multiple users (3+) can join

## 📊 Browser Console Debug Commands

Open browser console and run these to debug:

```javascript
// Check if WebRTC is supported
console.log('WebRTC supported:', !!window.RTCPeerConnection);

// Check media devices
navigator.mediaDevices.enumerateDevices()
  .then(devices => console.log('Devices:', devices));

// Check connection states
// (After joining call, in video-call-demo.html)
peerConnections.forEach((pc, userId) => {
  console.log(userId, {
    connection: pc.connectionState,
    ice: pc.iceConnectionState,
    signaling: pc.signalingState
  });
});

// Check local stream
console.log('Local stream:', localStream);
console.log('Video track:', localStream?.getVideoTracks()[0]);
console.log('Audio track:', localStream?.getAudioTracks()[0]);
```

## 🎨 Customization

### Change Server URL
In HTML demo, line ~220:
```javascript
socket = io('http://YOUR-SERVER-URL:PORT', {
  transports: ['websocket', 'polling']
});
```

In React component, pass as prop:
```tsx
<VideoCallComponent serverUrl="http://YOUR-SERVER-URL:PORT" />
```

### Modify Video Quality
```javascript
localStream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: { ideal: 1920 },  // Higher quality
    height: { ideal: 1080 },
    frameRate: { ideal: 30 }
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    sampleRate: 48000  // Higher quality audio
  }
});
```

### Add Screen Sharing
```javascript
async function shareScreen() {
  const screenStream = await navigator.mediaDevices.getDisplayMedia({
    video: true
  });
  
  // Replace video track in all peer connections
  const screenTrack = screenStream.getVideoTracks()[0];
  peerConnections.forEach((pc) => {
    const sender = pc.getSenders().find(s => s.track?.kind === 'video');
    if (sender) {
      sender.replaceTrack(screenTrack);
    }
  });
}
```

## 🔐 Security Considerations

⚠️ **Current Implementation:** Basic (good for development/testing)

### For Production:

1. **Authentication**
   ```typescript
   // Add to socket.ts
   io.use((socket, next) => {
     const token = socket.handshake.auth.token;
     // Verify token
     if (isValidToken(token)) {
       next();
     } else {
       next(new Error('Authentication failed'));
     }
   });
   ```

2. **Room Authorization**
   ```typescript
   socket.on('join-video-call', async (classroomId: string) => {
     // Verify user has access to this classroom
     const hasAccess = await checkUserAccess(socket.userId, classroomId);
     if (!hasAccess) {
       socket.emit('error', 'Unauthorized');
       return;
     }
     // ... rest of join logic
   });
   ```

3. **Rate Limiting**
   ```typescript
   import rateLimit from 'socket.io-rate-limit';
   
   io.use(rateLimit({
     tokensPerInterval: 10,
     interval: 1000
   }));
   ```

## 📈 Performance Tips

1. **Limit Grid Size:** For 10+ users, use pagination or featured speaker view
2. **Lower Quality for Mobile:** Detect mobile and reduce video quality
3. **Disable Video on Poor Connection:** Monitor stats and auto-disable
4. **Use SFU for Scale:** Switch to mediasoup/Janus for 7+ users

## 🆘 Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `NotAllowedError` | User denied permission | Re-request permission |
| `NotFoundError` | No camera/mic found | Check device connections |
| `NotReadableError` | Device in use | Close other apps |
| `OverconstrainedError` | Constraints too strict | Lower video quality |
| `TypeError: Cannot read property 'emit'` | Socket not connected | Wait for connection |
| `InvalidStateError` | Wrong signaling state | Check offer/answer flow |

## 📞 Support

If issues persist:
1. Check browser console for errors
2. Verify network connectivity
3. Test with different browsers
4. Check firewall settings
5. Review backend logs

## 🎓 Next Steps

1. **Test the HTML demo first** - Easiest way to verify everything works
2. **Integrate into your frontend** - Use the React component
3. **Add features** - Screen sharing, recording, chat
4. **Production hardening** - Auth, TURN servers, monitoring
5. **Scale** - Consider SFU for larger groups

---

**Created for NEXIO - Group Video Call Feature**
Last Updated: 2025-11-21
