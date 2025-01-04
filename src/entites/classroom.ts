import { Types } from 'mongoose';
import { User } from './User';

interface ClassroomMember {
    user: Types.ObjectId | User;
    role: 'admin' | 'moderator' | 'participant';
  }
  
  export interface Classroom {
    _id: Types.ObjectId;
    title: string;
    description?: string;
    type: 'public' | 'private';
    schedule: Date; 
    members: ClassroomMember[];
    inviteCode: string;
    inviteLink:string;
    createdAt: Date;
    admin: Types.ObjectId | User;

  }
  
