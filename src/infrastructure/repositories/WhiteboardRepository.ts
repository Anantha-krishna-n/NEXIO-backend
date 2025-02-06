import { Whiteboard } from "../../entites/whiteboard";
import { WhiteboardModel } from "../../infrastructure/databse/models/WhiteboardMode";
import { IWhiteboardRepository } from "../../interfaces/repositories/IWhiteboardRepository";

export class WhiteboardRepository implements IWhiteboardRepository {
  async create(whiteboardData: Partial<Whiteboard>): Promise<Whiteboard> {
    const whiteboard = new WhiteboardModel(whiteboardData);
    await whiteboard.save();
    return whiteboard.toObject();
  }

  async getByClassroomId(classroomId: string): Promise<Whiteboard | null> {
    return await WhiteboardModel.findOne({ classroomId }).lean();
  }

  async update(classroomId: string, elements: any[]): Promise<Whiteboard | null> {
    return await WhiteboardModel.findOneAndUpdate(
      { classroomId },
      { elements, updatedAt: new Date() },
      { new: true }
    ).lean();
  }
}