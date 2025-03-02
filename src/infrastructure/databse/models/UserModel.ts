import { profile, timeStamp } from 'console';
import mongoose, { Schema, Model } from 'mongoose';
import { string } from 'zod';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false },
  profilepic:{type: String,required:false},
  googleId: { type: String},
  subscription: {
    isActive: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
    plan: { type: String, enum: ['free', 'gold', 'platinum'], default: 'free' },
    availableClassroom: { 
      public: { type: Number, default: 0 }, 
      private: { type: Number, default: 0 } 
    }
},
  role: { type: String, enum: ['admin', 'moderator', 'participant'], default: 'participant' },
  otp: { type: String },
  otpExpires: { type: Date },
  verified:{type:Boolean , required:true , default:false},
  isBlocked:{type:Boolean,required:true,default:false},
  createdAt:{type:String,required:true},
  publicClassroomCount: { type: Number, default: 0 }, 
  privateClassroomCount: { type: Number, default: 0 },
});
;

export  const User: Model<any> = mongoose.model('User', UserSchema);