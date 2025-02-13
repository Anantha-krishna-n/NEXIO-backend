import { Types } from "mongoose";

export interface Document {
  _id: Types.ObjectId;
  classroomId: Types.ObjectId;
  adminId: Types.ObjectId;
  title: string;
  fileUrl: string;
  createdAt: Date;
}
