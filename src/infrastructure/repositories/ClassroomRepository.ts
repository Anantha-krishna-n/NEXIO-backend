import { Classroom } from "../../entites/classroom";
import { ClassroomModel } from "../databse/models/ClassroomModel";
import { IClassroomRepository } from "../../interfaces/repositories/IClassroomRepository";
import { Types } from "mongoose";

export class ClassroomRepository implements IClassroomRepository {
    async create(classroomData: Partial<Classroom>): Promise<Classroom> {
      return await ClassroomModel.create(classroomData);
    }
  }