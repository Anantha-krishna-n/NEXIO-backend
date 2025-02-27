import mongoose, { Schema, Model } from 'mongoose';
import { Classroom } from '../../../entites/classroom';

const ClassroomSchema = new Schema<Classroom>({
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['public', 'private'], required: true },
    schedule: { type: Date, required: true }, // Now required
    members: [{
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      role: { type: String, enum: ['admin', 'moderator', 'participant'], default: 'participant' }
    }],
    admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    inviteCode: { type: String, required: true, unique: true },
    inviteLink: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export const ClassroomModel: Model<Classroom> = mongoose.model<Classroom>('Classroom', ClassroomSchema);
  
  