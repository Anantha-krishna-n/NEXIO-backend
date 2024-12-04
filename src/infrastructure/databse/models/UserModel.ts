import mongoose, { Schema, Model } from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscription: {
    isActive: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
    plan: { type: String,required:false }, 
  },
  role: { type: String, enum: ['admin', 'moderator', 'participant'], default: 'participant' },
  verificationToken:{type:String , required:false},
  verified:{type:Boolean , required:true , default:false},
});
;

export const User: Model<any> = mongoose.model('User', UserSchema);