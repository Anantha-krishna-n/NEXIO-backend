import jwt from "jsonwebtoken";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import bcrypt from "bcryptjs";
import { IUserAuth } from "../interfaces/repositories/IUserAuth";
import { IToken } from "../interfaces/repositories/IToken";
import { IMailer } from "../interfaces/repositories/IMailer";
import { User } from "../entites/User";
import {  User as UserModel } from "../infrastructure/databse/models/UserModel"; 
import { Token } from "../external/Token";
import { Mailer } from "../external/Mailer";
import { generateOTP } from '../presentation/utils/otpUtil';



export class UserService implements IUserAuth {
  private userRepository: UserRepository;
  private tokenService: Token;
  

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
    this.tokenService = new Token();
    
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async generateOTP(email: string): Promise<string> {
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
    await this.userRepository.updateUser(email, { otp, otpExpires });
    return otp;
  }

  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const user = await this.findUserByEmail(email);
    if (!user || !user.otp || !user.otpExpires) {
      return false;
    }
    if (user.otp !== otp || user.otpExpires < new Date()) {
      return false;
    }
    await this.userRepository.updateUser(email, { verified: true, otp: null, otpExpires: null });
    return true;
  }

  async resendOTP(email: string): Promise<string> {
    return this.generateOTP(email);
  }

  async registerUser(name: string, email: string, password: string): Promise<User | null> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({ name, email, password: hashedPassword, verified: false });
    const otp = await this.generateOTP(email);

    // Send OTP via email
    const mailer = new Mailer();
    await mailer.SendEmail(email, `Your OTP is: ${otp}`);

    return user;
  } 
 async verifyUser(email: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }
  
    if (user.verified) {
      return user;
    }
  
    const updatedUser = await this.userRepository.updateUser(email, { verified: true });
    return updatedUser;
  }
  async loginUser(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      return null;
    }
    return user;
  }
}