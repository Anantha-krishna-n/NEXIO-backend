import mongoose, { Schema } from 'mongoose';
import { Subscription } from '../../../entites/subscription';
import { number } from 'zod';

const SubscriptionSchema = new Schema<Subscription>(
  {
    name: { 
      type: String, 
      required: true, 
      enum: ['free', 'gold', 'platinum'] 
    },
    description: {
      type: String,
      required: true
    },
    price: { 
      type: Number, 
      required: true,
      min: 0 
    },
    features: [{ 
      type: String,
      required: true 
    }],
    duration: { 
      type: Number, 
      required: true,
      min: 1 
    },
    availableClassroom: {
      public: { type: Number, required: false, default: 0 },
      private: { type: Number, required: false, default: 0 }
    },
    isActive: { 
      type: Boolean, 
      default: true 
    }
  },
  { timestamps: true }
);

export const SubscriptionModel = mongoose.model<Subscription>('Subscription', SubscriptionSchema);