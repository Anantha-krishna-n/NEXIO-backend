"use strict";
// import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
// import { IUser } from "../../infrastructure/databse/models/UserModel";
// import bcrypt from "bcrypt";
// export class SignupUser {
//   private userRepository: IUserRepository;
//   constructor(userRepository: IUserRepository) {
//     this.userRepository = userRepository;
//   }
//   async execute(userData: Partial<IUser>): Promise<IUser> {
//     const { email, password } = userData;
//     const existingUser = await this.userRepository.findByEmail(email || "");
//     if (existingUser) {
//       throw new Error("Email is already in use.");
//     }
//     const hashedPassword = await bcrypt.hash(password || "", 10);
//     const newUser = await this.userRepository.create({
//       ...userData,
//       password: hashedPassword,
//     });
//     return newUser;
//   }
// }
