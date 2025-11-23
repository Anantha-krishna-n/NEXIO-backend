import { Classroom } from "../../entites/classroom";
import { ClassroomModel } from "../databse/models/ClassroomModel";
import { IClassroomRepository } from "../../interfaces/repositories/IClassroomRepository";
import { Types } from "mongoose";

export class ClassroomRepository implements IClassroomRepository {
  static getUserClassroomsCounts(arg0: string) {
    throw new Error("Method not implemented.");
  }
  async create(classroomData: Partial<Classroom>): Promise<Classroom> {
    try {
      const classroom = new ClassroomModel(classroomData);
      await classroom.save();
      return classroom.toObject();
    } catch (error) {
      console.error("Error creating classroom:", error);
      throw new Error("Failed to create classroom.");
    }
  }
  
  async getPublicClassrooms(): Promise<Classroom[]> {
    try {
      return await ClassroomModel.find({ type: 'public' })
        .populate({ path: 'admin', select: 'name email profile' })
        .lean();
    } catch (error) {
      console.error("Error fetching public classrooms:", error);
      throw new Error("Failed to fetch public classrooms.");
    }
  }

  async getById(classroomId: string): Promise<Classroom | null> {
    try {
      return await ClassroomModel.findById(classroomId)
        .populate('admin', 'name email profile')
        .populate('members.user', 'name email profile')
        .lean();
    } catch (error) {
      console.error("Error fetching classroom by ID:", error);
      throw new Error("Failed to fetch classroom.");
    }
  }

   async addMember(classroomId: string, userId: string, isInvited: boolean = false): Promise<Classroom> {
    try {
      const classroom = await ClassroomModel.findById(classroomId);
      if (!classroom) {
        throw new Error("Classroom not found.");
      }

      const isAdmin = classroom.admin.toString() === userId;
      const role = isAdmin ? "admin" : "participant";

      const existingMember = classroom.members.find(
        member => member.user.toString() === userId
      );
      if (existingMember) {
        return classroom.toObject();
      }

      if (classroom.type === "private" && !isAdmin && !isInvited) {
        throw new Error("Only admin can join this private classroom without an invite.");
      }

      classroom.members.push({ user: new Types.ObjectId(userId), role });
      await classroom.save();

      return await ClassroomModel.findById(classroomId)
        .populate('admin', 'name email profile')
        .populate('members.user', 'name email profile')
        .lean() as Classroom;
    } catch (error) {
      console.error("Error adding member to classroom:", error);
      throw new Error("Failed to add member to classroom.");
    }
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
  async getByInviteCode(inviteCode: string): Promise<Classroom | null> {
    try {
      return await ClassroomModel.findOne({ inviteCode })
        .populate('admin', 'name email profile')
        .populate('members.user', 'name email profile')
        .lean();
    } catch (error) {
      console.error("Error fetching classroom by invite code:", error);
      throw new Error("Failed to fetch classroom.");
    }
  }
  async getClassroomWithMembers(classroomId: string): Promise<Classroom | null> {
    try {
      const classroom = await ClassroomModel.findById(classroomId)
        .populate('admin', 'name email profilepic')
        .populate('members.user', 'name email profilepic')
        .lean();

      if (!classroom) {
        console.error("Classroom not found:", classroomId);
        return null;
      }

      console.log("Fetched classroom members:", classroom.members);
      return classroom;
    } catch (error) {
      console.error("Error fetching classroom with members:", error);
      throw new Error("Failed to fetch classroom members.");
    }
  }
async getUserClassroomsCounts(userId: string): Promise<{ publicCount: number; privateCount: number }> {
  try {
    const classrooms = await ClassroomModel.find({
      $or: [
        { admin: new Types.ObjectId(userId) },
        { 'members.user': new Types.ObjectId(userId) }
      ]
    }).lean();

    const publicCount = classrooms.filter(classroom => classroom.type === 'public').length;
    const privateCount = classrooms.filter(classroom => classroom.type === 'private').length;

    return { publicCount, privateCount };
  } catch (error) {
    console.error('Error in getUserClassroomsCounts:', error);
    throw error;
  }
}
async getClassroomCountsPerMonth(): Promise<{ month: string; publicCount: number; privateCount: number }[]> {
  try {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); 

      const classroomCounts = await ClassroomModel.aggregate([
          {
              $match: {
                  createdAt: { $gte: sixMonthsAgo }, 
              }
          },
          {
              $group: {
                  _id: {
                      year: { $year: "$createdAt" }, 
                      month: { $month: "$createdAt" },
                      type: "$type"
                  },
                  count: { $sum: 1 }
              }
          },
          {
              $group: {
                  _id: { year: "$_id.year", month: "$_id.month" },
                  publicCount: {
                      $sum: { $cond: [{ $eq: ["$_id.type", "public"] }, "$count", 0] }
                  },
                  privateCount: {
                      $sum: { $cond: [{ $eq: ["$_id.type", "private"] }, "$count", 0] }
                  }
              }
          },
          {
              $sort: { "_id.year": 1, "_id.month": 1 }
          }
      ]);

      return classroomCounts.map(item => ({
          month: `${item._id.year}-${item._id.month.toString().padStart(2, "0")}`, // Format as YYYY-MM
          publicCount: item.publicCount,
          privateCount: item.privateCount
      }));
  } catch (error) {
      console.error("Error fetching classroom counts per month:", error);
      throw error;
  }
}


}



