import { ClassroomRepository } from "../infrastructure/repositories/ClassroomRepository";
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
    
        const classroomData: Partial<Classroom> = {
          title,
          description,
          type,
          schedule,
          inviteCode,
          members: [{ user: new Types.ObjectId(adminId), role: 'admin' }],
          admin: new Types.ObjectId(adminId),
          createdAt: new Date()
        };
    
        return await this.classroomRepository.create(classroomData);
      }
      async getPublicClassrooms(): Promise<Classroom[]> {
        return await this.classroomRepository.getPublicClassrooms();
      }
}