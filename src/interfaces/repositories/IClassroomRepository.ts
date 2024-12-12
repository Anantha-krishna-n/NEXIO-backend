import { Classroom } from "../../entites/classroom";
import { Types } from "mongoose";

export interface IClassroomRepository {
    create(classroomData: Partial<Classroom>): Promise<Classroom>;
  }
