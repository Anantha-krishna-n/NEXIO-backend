import { Subscription } from '../entites/subscription';
import { ISubscriptionRepository } from '../interfaces/repositories/ISubscriptionRepository';
import { SubscriptionRepository } from '../infrastructure/repositories/SubscriptionRepository';

export class SubscriptionService {
  private subscriptionRepository: ISubscriptionRepository;

  constructor(subscriptionRepository: ISubscriptionRepository) {
    this.subscriptionRepository = subscriptionRepository;
  }

  async createSubscription(data: {
    name: 'free' | 'gold' | 'platinum';
    description: string;
    price: number;
    features: string[];
    duration: number;
  }): Promise<Subscription> {
    if (data.name === 'free' && data.price !== 0) {
      throw new Error('Free plan must have price 0');
    }

    const existingPlan = await this.subscriptionRepository.findByName(data.name);
    if (existingPlan) {
      throw new Error(`Subscription plan "${data.name}" already exists`);
    }

    return await this.subscriptionRepository.create({
      ...data,
      isActive: true,
    });
  }

  async getAllSubscriptions(): Promise<Subscription[]> {
    return await this.subscriptionRepository.findAll();
  }

  async getActiveSubscriptions(): Promise<Subscription[]> {
    return await this.subscriptionRepository.findActive();
  }

  async getSubscriptionById(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findById(id);
    if (!subscription) {
      throw new Error('Subscription not found');
    }
    return subscription;
  }

  async updateSubscription(id: string, data: Partial<Subscription>): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.update(id, data);
    if (!subscription) {
      throw new Error('Subscription not found');
    }
    return subscription;
  }

  async deleteSubscription(id: string): Promise<void> {
    const subscription = await this.subscriptionRepository.findById(id);
    console.log("dtata",subscription)
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    if (subscription.name === 'free') {
      throw new Error('Cannot delete free subscription plan');
    }

    await this.subscriptionRepository.delete(id);
  }
}