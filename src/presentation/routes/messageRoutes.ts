import express, { Router } from "express";
import { MessageController } from "../controllers/messageController";
import { MessageService } from "../../services/MessageService";
import { MessageRepository } from "../../infrastructure/repositories/MessageRepository";

const repository=new MessageRepository();
const messageService=new MessageService(repository)
const controller=new MessageController(messageService)
const router = express.Router() 


router.post('/messages',controller.createMessage.bind(controller))
router.get('/:classroomId',controller.getMessagesByClassroom.bind(controller))
export default router;