import { User } from "../../entites/User";

export interface IUserRepository {
    create(data: Partial<User>): Promise<User>;
    // findById(email: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    // findByGoogleId(googleId: string): Promise<User | null>;
    updateUser(email: string, updateData: Partial<User>): Promise<User | null>;
  }
  