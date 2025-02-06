import express, { NextFunction, Request, Response } from "express";
import { WhiteboardController } from "../controllers/whitebordController";
import { WhiteboardRepository } from "../../infrastructure/repositories/WhiteboardRepository";
import { WhiteboardService } from "../../services/WhiteboardService";

const repository = new WhiteboardRepository();
const service = new WhiteboardService(repository);
const controller = new WhiteboardController(service);

const router = express.Router();

router.post('/initialize/:classroomId', controller.initializeWhiteboard.bind(controller));
router.get('/:classroomId', controller.getWhiteboard.bind(controller));
router.put('/:classroomId', controller.updateWhiteboard.bind(controller));

export default router;