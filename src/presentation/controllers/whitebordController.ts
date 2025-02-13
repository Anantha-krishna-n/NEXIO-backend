import { NextFunction, Request, Response } from "express";
import { WhiteboardService } from "../../services/WhiteboardService";
import { HttpStatusCode } from "../utils/HttpStatusCode";
import { ErrorMessages, SuccessMessages } from "../utils/Constants";

export class WhiteboardController {
  private whiteboardService: WhiteboardService;

  constructor(whiteboardService: WhiteboardService) {
    this.whiteboardService = whiteboardService;
  }

  async initializeWhiteboard(req: Request, res: Response, next: NextFunction) {
    console.log("inside the whiteboard...1")
    try {
      const { classroomId } = req.params;
      if (!classroomId) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ error: ErrorMessages.REQUIRED_FIELDS });
      }
      const whiteboard = await this.whiteboardService.initializeWhiteboard(classroomId);
      res.status(HttpStatusCode.OK).json({ message: SuccessMessages.WHITEBOARD_INITIALIZED, whiteboard });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.FAILED_TO_INITIALIZE_WHITEBOARD });
    }
  }

  async getWhiteboard(req: Request, res: Response, next: NextFunction) {
    console.log("inside the whiteboard...2")

    try {
      const { classroomId } = req.params;
      if (!classroomId) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ error: ErrorMessages.REQUIRED_FIELDS });
      }
      const whiteboard = await this.whiteboardService.getWhiteboardByClassroomId(classroomId);
      if (!whiteboard) {
        return res.status(HttpStatusCode.NOT_FOUND).json({ error: ErrorMessages.WHITEBOARD_NOT_FOUND });
      }
      res.status(HttpStatusCode.OK).json({ message: SuccessMessages.WHITEBOARD_FETCHED, whiteboard });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.FAILED_TO_FETCH_WHITEBOARD });
    }
  }

  async updateWhiteboard(req: Request, res: Response, next: NextFunction) {
    console.log("inside the whiteboard...3")

    try {
      const { classroomId } = req.params;
      const { elements } = req.body;
      if (!classroomId || !elements) {
        return res.status(HttpStatusCode.BAD_REQUEST).json({ error: ErrorMessages.REQUIRED_FIELDS });
      }
      const updatedWhiteboard = await this.whiteboardService.updateWhiteboard(classroomId, elements);
      if (!updatedWhiteboard) {
        return res.status(HttpStatusCode.NOT_FOUND).json({ error: ErrorMessages.WHITEBOARD_NOT_FOUND });
      }
      res.status(HttpStatusCode.OK).json({ message: SuccessMessages.WHITEBOARD_UPDATED, whiteboard: updatedWhiteboard });
    } catch (error) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ error: ErrorMessages.FAILED_TO_UPDATE_WHITEBOARD });
    }
  }
}