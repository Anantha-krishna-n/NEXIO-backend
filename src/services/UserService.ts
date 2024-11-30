import { UserRepository } from "../infrastructure/repositories/UserRepository";
import bcrypt from "bcrypt";
import { IUserAuth } from "../interfaces/repositories/IUserAuth";
import { User } from "../entites/User";
// import { createToken } from "../utils/jwt";

export class UserService implements IUserAuth {
  private userRepository = new UserRepository();
constructor(
  userRepository:UserRepository,
){
  this.userRepository=userRepository
}

  async registerUser(name:string, email :string, password:string ):Promise<User | null>{
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userRepository.create({ name, email, password: hashedPassword });
    return user;
  }
  async findUserByEmail(email:string):Promise<User | null>{
   const user=await this.userRepository.findByEmail(email)
   return user;
  }

  // async loginUser(email:string,password:string):Promise<User | null> {
  //   const user = await this.userRepository.findByEmail(email);
  //   if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
  //     throw new Error("Invalid credentials");
  //   }
  //   return createToken(user.id);
  // }
}
