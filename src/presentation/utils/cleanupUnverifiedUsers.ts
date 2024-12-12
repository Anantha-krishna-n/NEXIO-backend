import { UserService } from "../../services/UserService";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";

export async function cleanupUnverifiedUsers() {
  const userRepository = new UserRepository();
  const userService = new UserService(userRepository);

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const unverifiedUsers = await userRepository.findUnverifiedUsersBefore(twentyFourHoursAgo);

  for (const user of unverifiedUsers) {
    await userService.deleteUnverifiedUser(user.email);
  }
}

