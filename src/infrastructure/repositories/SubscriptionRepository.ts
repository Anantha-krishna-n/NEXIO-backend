import { ISubscriptionRepository } from "../../interfaces/repositories/ISubscriptionRepository";
import { Subscription } from "../../entites/subscription";
import { SubscriptionModel } from "../databse/models/subscriptionModel";


  export class SubscriptionRepository implements ISubscriptionRepository {
    
    async create(subscription: Partial<Subscription>): Promise<Subscription> {
      const newSubscription = new SubscriptionModel(subscription);
      await newSubscription.save();
      console.log("Saved subscription:", newSubscription.toObject());
      return newSubscription.toObject();
    }
  
    async findAll(): Promise<Subscription[]> {
      return await SubscriptionModel.find().lean();
    }
  
    async findActive(): Promise<Subscription[]> {
      return await SubscriptionModel.find({ isActive: true }).lean();
    }
  
    async findById(id: string): Promise<Subscription | null> {
      console.log("Finding subscription by ID:", id); // Log the ID
      try {
        
      const subscription = await SubscriptionModel.findById(id).lean();
        console.log("Query result:", subscription); // Log the query result
        return subscription;
      } catch (error) {
        console.error("Error in findById:", error);
        throw error; // Rethrow the error after logging
      }
    }
  
    async findByName(name: string): Promise<Subscription | null> {
      return await SubscriptionModel.findOne({ name, isActive: true }).lean();
    }
  
    async update(id: string, data: Partial<Subscription>): Promise<Subscription | null> {
      return await SubscriptionModel.findByIdAndUpdate(
        id,
        data,
        { new: true }
      ).lean();
    }
  
    async delete(id: string): Promise<void> {
      await SubscriptionModel.findByIdAndDelete(id);
    }
  }