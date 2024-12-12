import { Classroom } from "../../entites/classRoom";
import { Types } from "mongoose";

export interface IClassroomRepository {
    create(classroomData: Partial<Classroom>): Promise<Classroom>;
  }
