import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { User } from "../entites/User";
export class adminService{
    private userRepository: UserRepository;

      constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
      }
      async findUserById(userId: string): Promise<User | null> { // Implemented 
        const user = await this.userRepository.findById(userId);
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      } 
      async toggleBlockStatus(userId: string, isBlocked: boolean): Promise<User | null> {
        const user = await this.userRepository.toggleBlockStatus(userId, isBlocked);
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      } 
}