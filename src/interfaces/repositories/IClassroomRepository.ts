import { Classroom } from "../../entites/classroom";
import { Types } from "mongoose";

export interface IClassroomRepository {
    create(classroomData: Partial<Classroom>): Promise<Classroom>;
    getPublicClassrooms(): Promise<Classroom[]>;
    getById(classroomId: string): Promise<Classroom | null>;
    addMember(classroomId: string, userId: string): Promise<Classroom>;
    getPrivateClassroomsCreatedByUser(
      adminId: string,
      page: number,
      limit: number
    ): Promise<{ classrooms: Classroom[]; total: number }>; 
    getClassroomWithMembers(classroomId: string): Promise<Classroom | null>;
    getUserClassroomsCounts(userId:string): Promise<{publicCount:number,privateCount:number}>

   }
