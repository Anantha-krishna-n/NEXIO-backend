import { ClassroomRepository } from "../infrastructure/repositories/ClassroomRepository";
import { Classroom } from "../entites/classRoom";
import { Types } from "mongoose";

export class ClassroomService{
    private classroomRepository: ClassroomRepository

    constructor(classroomRepository: ClassroomRepository) {
        this.classroomRepository = classroomRepository;
      }

      async createClassroom(
        name: string,
        description: string,
        date: Date,
        time: string,
        isPublic: boolean,
        adminId: string
      ): Promise<Classroom> {
        const schedule = new Date(date);
        const [hours, minutes] = time.split(':').map(Number);
        schedule.setHours(hours, minutes);
    
        const classroomData: Partial<Classroom> = {
            title: name,
            description,
            schedule,
            type: isPublic ? 'public' : 'private', // Use correct type
            admin: new Types.ObjectId(adminId), // Ensure it's an ObjectId
          };
          
    
        const classroom = await this.classroomRepository.create(classroomData);
        return classroom;
      }




}