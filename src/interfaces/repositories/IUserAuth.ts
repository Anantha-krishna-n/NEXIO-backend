import {User} from "../../entites/User"

export interface IUserAuth {
    registerUser(name: string, email: string, password: string): Promise<User | null>;
    findUserByEmail(email: string): Promise<User | null>;
    loginUser(email: string, password: string): Promise<User | null>;
    verifyUser(email: string,otp:string): Promise<User | null>;
    generateOTP(email: string): Promise<string>;
    resendOTP(email: string): Promise<string>;
    findUserById(userId: string): Promise<User | null>; 
    updateUserDetails(
      userId: string,
      updateData: { name?: string; profilepic?: string; subscription?: any }
    ): Promise<any>;
    forgotPasswordRequest(email: string): Promise<boolean>;
    resetPassword(email: string, otp: string, newPassword: string): Promise<boolean>
  
  } 