import { ClassroomRepository } from "../infrastructure/repositories/ClassroomRepository";
import { IClassroomRepository } from "../interfaces/repositories/IClassroomRepository";
import { Classroom } from "../entites/classroom";
import { Types } from "mongoose";

export class ClassroomService{
    private classroomRepository: ClassroomRepository
    constructor(classroomRepository: ClassroomRepository) {
        this.classroomRepository = classroomRepository;
      }
      async createClassroom(
        title: string,
        description: string,
        date: Date,
        time: string,
        type: 'public' | 'private',
        adminId: string
      ): Promise<Classroom> {
        const schedule = new Date(date);
        const [hours, minutes] = time.split(':');
        schedule.setHours(parseInt(hours, 10), parseInt(minutes, 10));
      
        const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
        const inviteLink = type === 'private' ? `${process.env.SERVER_URL}/classroom/invite/${inviteCode}` : undefined;
      console.log(inviteLink,"inviteLink got ")
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
          ...(type === 'private' && { inviteLink }), 
        };
      
        return await this.classroomRepository.create(classroomData);
      }
      

      async getPublicClassrooms(): Promise<Classroom[]> {
        return await this.classroomRepository.getPublicClassrooms();
      }

      async getClassroomById(classroomId: string): Promise<Classroom | null> {
        return await this.classroomRepository.getById(classroomId);
      }
      async joinClassroom(classroomId: string, userId: string, isInvited: boolean = false): Promise<Classroom | boolean> {
        const classroom = await this.classroomRepository.getById(classroomId);
        console.log("Joining classroom:", { classroomId, userId, isInvited });
        
        if (!classroom) {
          throw new Error("Classroom not found.");
        }
    
        const isUserMember = classroom.members.some(member => {
          const memberId = member.user._id?.toString() || member.user?.toString();
          return memberId === userId;
        });
    
        console.log("Is user member:", isUserMember);
    
        if (!isUserMember) {
          return await this.classroomRepository.addMember(classroomId, userId, isInvited);
        }
    
        return true && classroom;
      }
    async getPrivateClassroomsCreatedByUser(
      adminId: string, 
      page: number = 1, 
      limit: number = 3
    ): Promise<{ classrooms: Classroom[]; total: number }> {
      return await this.classroomRepository.getPrivateClassroomsCreatedByUser(adminId, page, limit);
    }
    async validateInviteCode(inviteCode: string): Promise<Classroom | null> {
      const classroom = await this.classroomRepository.getByInviteCode(inviteCode);
      if (!classroom || classroom.type !== 'private') {
        throw new Error("Invalid or expired invite code.");
      }
      return classroom;
    }
    
    async getClassroomMembers(classroomId: string, userId: string): Promise<any[]> {
  const classroom = await this.classroomRepository.getClassroomWithMembers(classroomId);
  
  if (!classroom) {
    throw new Error("Classroom not found");
  }

  const isMember = classroom.members.some(member => 
    member.user._id.toString() === userId || 
    classroom.admin._id.toString() === userId
  );
  console.log(isMember,"members")
  if (!isMember) {
    throw new Error("Unauthorized access to classroom members");
  }

  return classroom.members;

}
async getClassroomInviteLink(classroomId: string): Promise<string | null> {
  const classroom = await this.classroomRepository.getById(classroomId);
  console.log(classroom,"service")
  if (!classroom || classroom.type !== "private") {
    throw new Error("Classroom not found or is not private.");
  }
  return classroom.inviteLink || null;
}
async getUserClassrooms(userId: string): Promise<{ publicCount: number; privateCount: number }> {
  return await this.classroomRepository.getUserClassroomsCounts(userId);
}

}