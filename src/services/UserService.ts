import bcrypt from "bcryptjs";
import { IUserAuth } from "../interfaces/repositories/IUserAuth";
import { User } from "../entites/User";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { Token } from "../external/Token";
import { Mailer } from "../external/Mailer";
import { generateOTP } from '../presentation/utils/otpUtil';

export class UserService implements IUserAuth {
  private userRepository: UserRepository;
  private tokenService: Token;
  private mailer: Mailer;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
    this.tokenService = new Token();
    this.mailer = new Mailer();
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async generateOTP(email: string): Promise<string> {
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); 
    await this.userRepository.updateUser(email, { otp, otpExpires });
    return otp;
  }

  async registerUser(name: string, email: string, password: string): Promise<User | null> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({ 
      name, 
      email, 
      password: hashedPassword, 
      verified: false,
      createdAt: new Date() 
    });
    const otp = await this.generateOTP(email);

    await this.mailer.SendEmail(email, `Your OTP is: ${otp}`);

    setTimeout(() => this.deleteUnverifiedUser(email), 24 * 60 * 60 * 1000);

    return user;
  }

  async verifyUser(email: string, otp: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user || !user.otp || !user.otpExpires) {
      return null;
    }

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return null;
    }

    const updatedUser = await this.userRepository.updateUser(email, { verified: true, otp: null, otpExpires: null });
    return updatedUser;
  }
  async verifyOTP(email: string, otp: string): Promise<boolean> {
    const user = await this.findUserByEmail(email);
    if (!user || !user.otp || !user.otpExpires) {
      return false;
    }

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return false;
    }

    return true;
  }


    async resendOTP(email: string): Promise<string> {
    const otp = await this.generateOTP(email);
    await this.mailer.SendEmail(email, `Your new OTP is: ${otp}`);
    return otp;
  }

  async loginUser(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    console.log("user",user)
    if (!user) {
      return null;
    }

    if (!user.verified) {
      throw new Error("User not verified");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password || '');
    if (!isPasswordValid) {
      return null;
    }
    console.log("return ,",user)
    return user;
  }

  async deleteUnverifiedUser(email: string): Promise<void> {
    const user = await this.findUserByEmail(email);
    if (user && !user.verified) {
      await this.userRepository.deleteUser(email);
    }
  }
  async findUserById(userId: string): Promise<User | null> { 
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
  async findOrCreateGoogleUser(profile: any): Promise<User> {
    let user = await this.userRepository.findByGoogleId(profile.id);
    if (!user) {
      user = await this.userRepository.create({
        name: profile.displayName,
        email: profile.emails[0].value,
        googleId: profile.id,
        profilepic: profile.photos[0].value,
        verified: true,
      });
    }
    return user;
  }

}

