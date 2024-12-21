import { profile } from 'console';
import mongoose, { Schema, Model } from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilepic:{type: String,required:false},
  subscription: {
    isActive: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
    plan: { type: String,required:false }, 
  },
  role: { type: String, enum: ['admin', 'moderator', 'participant'], default: 'participant' },
  otp: { type: String },
  otpExpires: { type: Date },
  verified:{type:Boolean , required:true , default:false},
  isBlocked:{type:Boolean,required:true,default:false},
});
;

export const User: Model<any> = mongoose.model('User', UserSchema);