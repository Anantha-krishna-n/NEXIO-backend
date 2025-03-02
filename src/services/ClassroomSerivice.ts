import { ClassroomRepository } from "../infrastructure/repositories/ClassroomRepository";
import { UserRepository } from "../infrastructure/repositories/UserRepository";
import { IClassroomRepository } from "../interfaces/repositories/IClassroomRepository";
import { IUserRepository } from "../interfaces/repositories/IUserRepository";
import { Classroom } from "../entites/classroom";
import { SUBSCRIPTION_LIMITS } from "../external/SUBSCRIPTION_LIMITS";
import { Types } from "mongoose";
import { log } from "console";

export class ClassroomService {
  private classroomRepository: ClassroomRepository;
  private userRepository: UserRepository;

  constructor(
    classroomRepository: ClassroomRepository,
    userRepository: UserRepository
  ) {
    this.classroomRepository = classroomRepository;
    this.userRepository = userRepository;
  }
  async createClassroom(
    title: string,
    description: string,
    date: Date,
    time: string,
    type: "public" | "private",
    adminId: string
  ): Promise<Classroom> {
    console.log("Entered into classroomService");

    const user = await this.userRepository.findById(adminId);
    if (!user) {
      throw new Error("user not found");
    }
 
    const schedule = new Date(date);
    const [hours, minutes] = time.split(":");
    schedule.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const inviteLink =
      type === "private"
        ? `${process.env.SERVER_URL}/classroom/invite/${inviteCode}`
        : undefined;
    console.log(inviteLink, "inviteLink got ");

    const availableClassrooms = user.subscription?.availableClassroom ?? { public: 0, private: 0 };

 
    await this.userRepository.updateSubscriptionClassroomCount(adminId, type, true);

    
    const classroomData: Partial<Classroom> = {
      title,
      description,
      type,
      schedule,
      inviteCode,
      inviteLink,
      members: [],
      admin: new Types.ObjectId(adminId),
      createdAt: new Date(),
      ...(type === "private" && { inviteLink }),
    };
    const fieldToUpdate =
      type === "public" ? "publicClassroomCount" : "privateClassroomCount";
    await this.userRepository.incrementUserField(adminId, fieldToUpdate, 1);
    return await this.classroomRepository.create(classroomData);
  }

  async checkClassRoomAvl(adminId: string, type: string): Promise<{ status: boolean, msg: string, remainingClassrooms?: number }> {
    const user = await this.userRepository.findById(adminId);
    if (!user) {
      throw new Error("User not found");
    }
  
    const { publicCount, privateCount } = await this.classroomRepository.getUserClassroomsCounts(adminId);
  
    console.log(`Public Count: ${publicCount}, Private Count: ${privateCount}`);
  
    const subscriptionPlan = user.subscription?.plan || "free";
    const subscriptionStatus = user.subscription?.isActive;
    const expDate = user.subscription?.endDate ? new Date(user.subscription.endDate) : null;
  
    console.log(`Subscription Plan: ${subscriptionPlan}`);
  

  
    if (expDate && expDate < new Date()) {
      return { status: false, msg: "Your subscription has expired." };
    }
  
    const SUBSCRIPTION_LIMITS: Record<string, { public: number; private: number }> = {
      free: { public: 2, private: 2 },
      gold: { public: 10, private: 10 },
      platinum: { public: 20, private: 20 },
    };
  
    const limits = SUBSCRIPTION_LIMITS[subscriptionPlan];
    if (!limits) {
      return { status: false, msg: "Invalid subscription plan." };
    }
  
    if (type === "public" && publicCount >= limits.public) {
      return { status: false, msg: `You have reached your public classroom limit for the ${subscriptionPlan} plan.`, remainingClassrooms: 0 };
    }
  
    if (type === "private" && privateCount >= limits.private) {
      return { status: false, msg: `You have reached your private classroom limit for the ${subscriptionPlan} plan.`, remainingClassrooms: 0 };
    }
  
    const remainingClassrooms = type === "public" ? limits.public - publicCount : limits.private - privateCount;
  
    return { status: true, msg: "Eligible to create classroom.", remainingClassrooms };
  }
  

  async getPublicClassrooms(): Promise<Classroom[]> {
    return await this.classroomRepository.getPublicClassrooms();
  }

  async getClassroomById(classroomId: string): Promise<Classroom | null> {
    return await this.classroomRepository.getById(classroomId);
  }
  async joinClassroom(
    classroomId: string,
    userId: string,
    isInvited: boolean = false
  ): Promise<Classroom | boolean> {
    const classroom = await this.classroomRepository.getById(classroomId);
    console.log("Joining classroom:", { classroomId, userId, isInvited });

    if (!classroom) {
      throw new Error("Classroom not found.");
    }

    const isUserMember = classroom.members.some((member) => {
      const memberId = member.user._id?.toString() || member.user?.toString();
      return memberId === userId;
    });

    console.log("Is user member:", isUserMember);

    if (!isUserMember) {
      return await this.classroomRepository.addMember(
        classroomId,
        userId,
        isInvited
      );
    }

    return true && classroom;
  }
  async getPrivateClassroomsCreatedByUser(
    adminId: string,
    page: number = 1,
    limit: number = 3
  ): Promise<{ classrooms: Classroom[]; total: number }> {
    return await this.classroomRepository.getPrivateClassroomsCreatedByUser(
      adminId,
      page,
      limit
    );
  }
  async validateInviteCode(inviteCode: string): Promise<Classroom | null> {
    const classroom = await this.classroomRepository.getByInviteCode(
      inviteCode
    );
    if (!classroom || classroom.type !== "private") {
      throw new Error("Invalid or expired invite code.");
    }
    return classroom;
  }

  async getClassroomMembers(
    classroomId: string,
    userId: string
  ): Promise<any[]> {
    const classroom = await this.classroomRepository.getClassroomWithMembers(
      classroomId
    );

    if (!classroom) {
      throw new Error("Classroom not found");
    }

    const isMember = classroom.members.some(
      (member) =>
        member.user._id.toString() === userId ||
        classroom.admin._id.toString() === userId
    );
    console.log(isMember, "members");
    if (!isMember) {
      throw new Error("Unauthorized access to classroom members");
    }

    return classroom.members;
  }
  async getClassroomInviteLink(classroomId: string): Promise<string | null> {
    const classroom = await this.classroomRepository.getById(classroomId);
    console.log(classroom, "service");
    if (!classroom || classroom.type !== "private") {
      throw new Error("Classroom not found or is not private.");
    }
    return classroom.inviteLink || null;
  }
  async getUserClassrooms(
    userId: string
  ): Promise<{ publicCount: number; privateCount: number }> {
    return await this.classroomRepository.getUserClassroomsCounts(userId);
  }
}
