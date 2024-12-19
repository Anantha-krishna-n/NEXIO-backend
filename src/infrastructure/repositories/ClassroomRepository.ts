import { Classroom } from "../../entites/classroom";
import { ClassroomModel } from "../databse/models/ClassroomModel";
import { IClassroomRepository } from "../../interfaces/repositories/IClassroomRepository";
import { Types } from "mongoose";

export class ClassroomRepository implements IClassroomRepository {
  async create(classroomData: Partial<Classroom>): Promise<Classroom> {
    const classroom = new ClassroomModel(classroomData);
    await classroom.save();
    return classroom.toObject();
  }
  async getPublicClassrooms(): Promise<Classroom[]> {
    const publicClassrooms = await ClassroomModel.find({ type: 'public' })
      .populate({
        path: 'admin',
        select: 'name email profile'  
      })
      .lean();
    return publicClassrooms;
  }
  async getById(classroomId: string): Promise<Classroom | null> {
    return await ClassroomModel.findById(classroomId)
      .populate('admin', 'name email profile')
      .populate('members.user', 'name email profile')
      .lean();
  }
  async addMember(classroomId: string, userId: string): Promise<Classroom> {
    const classroom = await ClassroomModel.findById(classroomId);
    if (!classroom) {
        throw new Error("Classroom not found.");
    }


    // Check if the user is the admin of the classroom
    const isAdmin = classroom.admin.toString() === userId;
    const role = isAdmin ? "admin" : "participant";

    // If not admin, restrict entry for participants (optional condition here)
    if (!isAdmin && classroom.type === "private") {
        throw new Error("Only admin can join this classroom.");
    }

    // Add the new member with appropriate role
    classroom.members.push({ user: new Types.ObjectId(userId), role });

    await classroom.save();
    return classroom.toObject();
}
}



