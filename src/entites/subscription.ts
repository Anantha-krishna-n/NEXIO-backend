import { Types } from "mongoose";

export interface Subscription {
  _id: Types.ObjectId;
  name: string;          
  description: string;
  price: number;
  features: string[];
  availableClassroom?: {
    public: number;
    private: number;
  };
  duration: number;      
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}