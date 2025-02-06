import mongoose, { Schema, Model } from 'mongoose';
import { Whiteboard } from '../../../entites/whiteboard'

const WhiteboardSchema = new Schema<Whiteboard>({
  classroomId: { type: Schema.Types.ObjectId, ref: 'Classroom', required: true },
  elements: { type: Schema.Types.Mixed, default: [] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const WhiteboardModel: Model<Whiteboard> = mongoose.model('Whiteboard', WhiteboardSchema);