import { User } from "../../entites/User";

export interface IUserRepository {
    create(data: Partial<User>): Promise<User>;
    findById(userId: string): Promise<any>;
    findByEmail(email: string): Promise<User | null>;
    findByGoogleId(googleId: string): Promise<User | null>;
    createOrUpdateGoogleUser(profile: any): Promise<any>;
    updateUser(email: string, updateData: Partial<User>): Promise<User | null>;
    deleteUser(email: string): Promise<void>;
    findUnverifiedUsersBefore(date: Date): Promise<User[]>;
    toggleBlockStatus(userId: string, isBlocked: boolean): Promise<User | null>;
    getAllUsers(page: number, limit: number): Promise<{ users: User[]; total: number }>;
    findById(userId: string): Promise<any>;
   
  }
  