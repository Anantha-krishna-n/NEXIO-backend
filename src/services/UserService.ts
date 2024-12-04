import jwt from "jsonwebtoken";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import bcrypt from "bcryptjs";
import { IUserAuth } from "../interfaces/repositories/IUserAuth";
import { IToken } from "../interfaces/repositories/IToken";
import { User } from "../entites/User";
import { User as UserModel } from "../infrastructure/databse/models/UserModel"; 

export class UserService implements IUserAuth {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  
  async registerUser(name: string, email: string, password: string): Promise<User | null> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({ name, email, password: hashedPassword });
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    return user;
  }

  async loginUser(email: string, password: string): Promise<User | null> {
    const user = await this.findUserByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.password) {
      throw new Error("Password not set for this user");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: "1d" });

    const { password: _, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, token } as User;
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
  
}