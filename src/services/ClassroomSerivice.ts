import { ClassroomRepository } from "../infrastructure/repositories/ClassroomRepository";
import { Classroom } from "../entites/classroom";
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
            type: isPublic ? 'public' : 'private', 
            admin: new Types.ObjectId(adminId), 
          };
          
    
        const classroom = await this.classroomRepository.create(classroomData);
        return classroom;
      }




}