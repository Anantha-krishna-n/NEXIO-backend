import { Request, Response } from "express";
import { ClassroomService } from "../../services/ClassroomSerivice";

export class ClassroomController {
  private classroomService: ClassroomService;

  constructor(classroomService: ClassroomService) {
    this.classroomService = classroomService;
  }

  async createClassroom(req: Request, res: Response) {
    try {
      const { name, description, date, time, isPublic } = req.body;
      const adminId =" req.user._id; "

      if (!name || !date || !time) {
        return res.status(400).json({ error: "Name, date, and time are required" });
      }

      const classroom = await this.classroomService.createClassroom(
        name,
        description,
        new Date(date),
        time,
        isPublic,
        adminId
      );
      res.status(201).json(classroom);
    } catch (error) {
      res.status(500).json({ error: "Failed to create classroom" });
    }
  }
}

