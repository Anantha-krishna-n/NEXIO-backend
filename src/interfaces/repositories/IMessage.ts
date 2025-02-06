import { Message } from "../../entites/message";

export interface IMessage {
    createMessage(messageData: Partial<Message>): Promise<Message>;
    getMessagesByClassroom(classroomId: string): Promise<Message[]>;
  }