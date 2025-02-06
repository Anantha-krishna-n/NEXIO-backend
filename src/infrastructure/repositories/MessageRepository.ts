import { MessageModel } from "../databse/models/MessageModel";
import { IMessage } from "../../interfaces/repositories/IMessage";
import { Message } from "../../entites/message";

export class MessageRepository implements IMessage {
  async createMessage(messageData: Partial<Message>): Promise<Message> {
    const message = new MessageModel(messageData);
    await message.save();
    return message.toObject();
  }

  async getMessagesByClassroom(classroomId: string): Promise<Message[]> {
    return await MessageModel.find({ classroomId })
      .populate("userId", "name email profile") 
      .sort({ timestamp: 1 })
      .lean();
  }
}