import { User } from "../../entites/User";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import  { User as UserModel } from "../databse/models/UserModel";

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email });
  }
  async create(user: Partial<User>): Promise<User> {
    return await UserModel.create(user);
  }
  async updateUser(email: string, updateData: Partial<User>): Promise<User | null> {
    return await UserModel.findOneAndUpdate({ email }, updateData, { new: true });
  }
  async deleteUser(email: string): Promise<void> {
    await UserModel.findOneAndDelete({ email });
  }
  async findUnverifiedUsersBefore(date: Date): Promise<User[]> {
    return await UserModel.find({
      verified: false,
      createdAt: { $lt: date }
    });
  }
  async findById(userId: string): Promise<User | null> { 
    return await UserModel.findById(userId);
  }
  async toggleBlockStatus(userId: string, isBlocked: boolean): Promise<User | null> {
    return await UserModel.findByIdAndUpdate(
      userId,
      { isBlocked },
      { new: true }
    );
  }
  async getAllUsers(page: number, limit: number): Promise<{ users: User[]; total: number }> {
    console.log("dsfd")
    const skip = (page - 1) * limit;
    const users = await UserModel.find().skip(skip).limit(limit);
    const total = await UserModel.countDocuments();
    return { users, total };
  }
}
