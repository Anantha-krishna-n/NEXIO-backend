import { Types } from 'mongoose';

export interface Whiteboard {
  _id: Types.ObjectId;
  classroomId: Types.ObjectId; 
  elements: any[]; 
  createdAt: Date;
  updatedAt: Date;
}