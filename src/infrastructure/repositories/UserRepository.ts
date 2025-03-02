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
  async findByGoogleId(googleId: string): Promise<User | null> {
    return await UserModel.findOne({ googleId });
  }
  
  async toggleBlockStatus(userId: string, isBlocked: boolean): Promise<User | null> {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: { isBlocked: isBlocked } },
            { new: true }
        );
        return updatedUser;
    } catch (error) {
        console.error("Error in toggleBlockStatus:", error);
        throw error;
    }
}
  async getAllUsers(page: number, limit: number): Promise<{ users: User[]; total: number }> {
    console.log("dsfd")
    const skip = (page - 1) * limit;
    const users = await UserModel.find().skip(skip).limit(limit);
    const total = await UserModel.countDocuments();
    return { users, total };
  }

  async createOrUpdateGoogleUser(profile: any): Promise<User> {
    console.log("Google profile received:", profile);
  
    const existingUser = await UserModel.findOne({ googleId: profile.id });
  
    if (existingUser) {
      return existingUser;
    } else {
      const userByEmail = await UserModel.findOne({
        email: profile.emails[0].value,
      });
  
      if (userByEmail) {
        userByEmail.googleId = profile.id;
        await userByEmail.save();
        return userByEmail;
      } else {
        const newUser = new UserModel({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          profile: profile.photos[0].value,
          verified: true,
        });
  
        await newUser.save();
        return newUser;
      }
    }
  }
  async updateUserPartialy(userId: string, updateData: Partial<User>): Promise<User | null> {
    return await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );
  }
  async incrementUserField(userId: string, field: string, value: number): Promise<User | null> {
    return await UserModel.findByIdAndUpdate(
      userId,
      { $inc: { [field]: value } }, 
      { new: true }
    );
  }
  async updateSubscriptionClassroomCount(userId: string, type: "public" | "private", decrement: boolean): Promise<User | null> {
    const update = decrement 
        ? { $inc: { [`subscription.availableClassroom.${type}`]: -1 } }
        : { $inc: { [`subscription.availableClassroom.${type}`]: 1 } };

    return await UserModel.findByIdAndUpdate(userId, update, { new: true });
}

}
