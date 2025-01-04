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
      
        // Generate invite link only for private classrooms
        const inviteLink = type === 'private' ? `https://yourdomain.com/classroom/invite/${inviteCode}` : undefined;
      console.log(inviteLink,"inviteLink got ")
        const classroomData: Partial<Classroom> = {
          title,
          description,
          type,
          schedule,
          inviteCode,
          inviteLink, // This will only be `string` or `undefined`
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
      async joinClassroom(classroomId: string, userId: string): Promise<Classroom | boolean> {
        const classroom = await this.classroomRepository.getById(classroomId);
        if (!classroom) {
            throw new Error("Classroom not found.");
        }
    
        const isUserMember = classroom.members.some(member => 
          member.user._id.toString() === userId.toString()
      );
      
           console.log('////////',isUserMember);
           
        if (!isUserMember) {
          return await this.classroomRepository.addMember(classroomId, userId);

        }
    return true
        
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
    
    
}