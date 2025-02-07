import { Server, Socket } from "socket.io";

export const setupSocketIO = (io: Server) => {
  console.log("soket ....")
  io.on("connection", (socket) => {
    console.log("a user connected:", socket.id);

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
        timestamp: message.timestamp
      });
    });;

    socket.on("whiteboard-update", (data) => {
      socket.to(data.roomId).emit("whiteboard-update", data.elements);
    });
    
    socket.on("disconnect", () => {
      console.log("user disconnected:", socket.id);
    });
  });
};