import { Server, Socket } from "socket.io";

export const setupSocketIO = (io: Server) => {
  console.log("Socket.IO server initialized");

  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-video-call", ({ classroomId, userName }: { classroomId: string; userName: string }) => {
      socket.join(classroomId);
      console.log(`User ${userName} (${socket.id}) joined video call in classroom ${classroomId}`);

      socket.to(classroomId).emit("user-joined", { userId: socket.id,userName});
 

      const room = io.sockets.adapter.rooms.get(classroomId);
const users = Array.from(room || []).map(id => ({
    userId: id,
    userName: io.sockets.sockets.get(id)?.data?.userName || null
  }));
        socket.emit("existing-users", users);
          socket.data.userName = userName;

    });

    socket.on("webrtc-offer", ({ classroomId, offer, from, to }) => {
      console.log(`Forwarding offer from ${from} to ${to}`);
      io.to(to).emit("webrtc-offer", { offer, from });
    });

    socket.on("webrtc-answer", ({ classroomId, answer, from, to }) => {
      console.log(`Forwarding answer from ${from} to ${to}`);
      io.to(to).emit("webrtc-answer", { answer, from });
    });

    socket.on("webrtc-candidate", ({ classroomId, candidate, from, to }) => {
      console.log(`Forwarding ICE candidate from ${from} to ${to}`);
      io.to(to).emit("webrtc-candidate", { candidate, from });
    });

    socket.on("leave-video-call", (classroomId: string) => {
      socket.leave(classroomId);
      socket.to(classroomId).emit("user-left", { userId: socket.id });
      console.log(`User ${socket.id} left video call in classroom ${classroomId}`);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      socket.rooms.forEach(room => {
        if (room !== socket.id) {
          socket.to(room).emit("user-left", { userId: socket.id });
        }
      });
    });

    socket.on("joinClassroom", (classroomId: string) => {
      socket.join(classroomId);
      console.log(`User ${socket.id} joined classroom ${classroomId}`);
    });

    socket.on("sendMessage", (classroomId: string, message: any) => {
      io.to(classroomId).emit("receiveMessage", {
        _id: message._id,
        userId: message.userId,
        userName: message.userName,
        message: message.message,
        timestamp: message.timestamp,
      });
    });

    socket.on("whiteboard-update", (data: any) => {
      socket.to(data.roomId).emit("whiteboard-update", data.elements);
    });
  });
};  

   


