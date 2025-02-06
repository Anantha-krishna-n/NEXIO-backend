import { Types } from "mongoose";
import { Message } from "../entites/message";
import { IMessage } from "../interfaces/repositories/IMessage";

export class MessageService {
  private messageRepository: IMessage;

  constructor(messageRepository: IMessage) {
    this.messageRepository = messageRepository;
  }

  async createMessage(classroomId: string, userId: string, message: string,userName:string): Promise<Message> {
    return await this.messageRepository.createMessage({
      classroomId: new Types.ObjectId(classroomId),
      userId: new Types.ObjectId(userId),
      userName,
      message,
    });
  }

  async getMessagesByClassroom(classroomId: string): Promise<Message[]> {
    return await this.messageRepository.getMessagesByClassroom(classroomId);
  }
}
