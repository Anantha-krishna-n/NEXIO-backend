import { Subscription } from "../../entites/subscription";


export interface ISubscriptionRepository {
  create(subscription: Partial<Subscription>): Promise<Subscription>;
  findAll(): Promise<Subscription[]>;
  findActive(): Promise<Subscription[]>;
  findById(id: string): Promise<Subscription | null>;
  findByName(name: string): Promise<Subscription | null>;
  update(id: string, data: Partial<Subscription>): Promise<Subscription | null>;
  delete(id: string): Promise<void>;
}