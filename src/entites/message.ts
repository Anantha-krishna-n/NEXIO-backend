import { Types } from "mongoose";

export interface Message {
  _id?: Types.ObjectId;
  classroomId: Types.ObjectId;
  userId: Types.ObjectId;
  userName:string;
  message: string;
  timestamp: Date;
}