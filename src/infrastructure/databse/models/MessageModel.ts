import mongoose, { Schema } from "mongoose";
import { Message } from "../../../entites/message";


const MessageSchema = new Schema<Message>({
    classroomId: { type: Schema.Types.ObjectId, ref: "Classroom", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true }, 
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  });
  
  export const MessageModel = mongoose.model<Message>("Message", MessageSchema);