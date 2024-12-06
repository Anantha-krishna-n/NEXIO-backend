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
}
