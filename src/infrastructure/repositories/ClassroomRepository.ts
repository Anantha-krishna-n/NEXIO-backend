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
    const isAdmin = classroom.admin.toString() === userId;
    const role = isAdmin ? "admin" : "participant";

    if (!isAdmin && classroom.type === "private") {
        throw new Error("Only admin can join this classroom.");
    }

    classroom.members.push({ user: new Types.ObjectId(userId), role });

    await classroom.save();
    return classroom.toObject();
}
async getPrivateClassroomsCreatedByUser(
  adminId: string, 
  page: number = 1, 
  limit: number = 3
): Promise<{ classrooms: Classroom[]; total: number }> {
  try {
    const skip = (page - 1) * limit;
    
    const [classrooms, total] = await Promise.all([
      ClassroomModel.find({
        type: "private",
        admin: new Types.ObjectId(adminId),
      })
        .populate({
          path: "admin",
          select: "name email profile",
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      
      ClassroomModel.countDocuments({
        type: "private",
        admin: new Types.ObjectId(adminId),
      })
    ]);

    return { classrooms, total };
  } catch (error) {
    console.error('Error in getPrivateClassroomsCreatedByUser:', error);
    throw error;
  }
}
async getClassroomByInviteCode(inviteCode: string): Promise<Classroom | null> {
  return await ClassroomModel.findOne({ inviteCode })
    .populate('admin', 'name email profile')
    .populate('members.user', 'name email profile')
    .lean();
}

}



