import { User } from "../../entites/User";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import  { User as UserModel } from "../databse/models/UserModel";

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return await UserModel.findOne({ googleId });
  }

  async create(user: Partial<User>): Promise<User> {
    return await UserModel.create(user);
  }
}
