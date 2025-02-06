import { Request, Response } from "express";
import { HttpStatusCode } from "../utils/HttpStatusCode";
import { MessageService } from "../../services/MessageService";
import { ErrorMessages, SuccessMessages } from "../utils/Constants";

export class MessageController {
  private messageService: MessageService;

  constructor(messageService: MessageService) {
    this.messageService = messageService;
  }

  async createMessage(req: Request, res: Response) {
    try {
      console.log('get entered')
      const { classroomId, userId, message,userName } = req.body;

      if (!classroomId || !userId || !message) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ error: ErrorMessages.ALL_FIELDS_REQUIRED });
      }

      const newMessage = await this.messageService.createMessage(classroomId, userId, message,userName);
      res
        .status(HttpStatusCode.CREATED)
        .json({ message: SuccessMessages.MESSAGE_SENT, data: newMessage });
    } catch (error) {
      console.error("Error creating message:", error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: ErrorMessages.FAILED_TO_SEND_MESSAGE });
    }
  }

  async getMessagesByClassroom(req: Request, res: Response) {
    try {
      const { classroomId } = req.params;

      if (!classroomId) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ error: ErrorMessages.ALL_FIELDS_REQUIRED });
      }

      const messages = await this.messageService.getMessagesByClassroom(classroomId);
      res.status(HttpStatusCode.OK).json({ messages });
    } catch (error) {
      console.error("Error fetching messages:", error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: ErrorMessages.AILED_TO_FETCH_MESSAGES });
    }
  }
}
