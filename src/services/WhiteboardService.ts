import { Types } from "mongoose";
import { Whiteboard } from "../entites/whiteboard";
import { WhiteboardRepository } from "../infrastructure/repositories/WhiteboardRepository";

export class WhiteboardService {
  private whiteboardRepository: WhiteboardRepository;

  constructor(whiteboardRepository: WhiteboardRepository) {
    this.whiteboardRepository = whiteboardRepository;
  }

  async initializeWhiteboard(classroomId: string): Promise<Whiteboard> {
    const existingWhiteboard = await this.whiteboardRepository.getByClassroomId(classroomId);
    if (existingWhiteboard) {
      return existingWhiteboard;
    }
    const whiteboardData: Partial<Whiteboard> = {
      classroomId: new Types.ObjectId(classroomId),
      elements: [],
    };
    return await this.whiteboardRepository.create(whiteboardData);
  }

  async getWhiteboardByClassroomId(classroomId: string): Promise<Whiteboard | null> {
    return await this.whiteboardRepository.getByClassroomId(classroomId);
  }

  async updateWhiteboard(classroomId: string, elements: any[]): Promise<Whiteboard | null> {
    return await this.whiteboardRepository.update(classroomId, elements);
  }
}