import { Request, Response } from "express";

import { ClassroomService } from "../../services/ClassroomSerivice";
import jwt from "jsonwebtoken";

export class ClassroomController {
  private classroomService: ClassroomService;

  constructor(classroomService: ClassroomService) {
    this.classroomService = classroomService;
  }

  async createClassroom(req: Request, res: Response) {
    try {
 
      const { title, description, date, time, type } = req.body;
      const adminId = req.userId;
      console.log(adminId,"adminId ")//this is the userId of the user who logged in and create the room
      
      if (!title || !date || !time) {
        return res.status(400).json({ error: "Name, date, and time are required" });
      }

      const classroom = await this.classroomService.createClassroom(
        title,
        description,
        new Date(date),
        time,
        type,
        adminId as string
      );
      console.log("classroom",classroom)
      res.status(201).json(classroom);
    } catch (error) {
      res.status(500).json({ error: "Failed to create classroom" });
    }
  }
  async getPublicClassrooms(req: Request, res: Response) {
    try {
      const publicClassrooms = await this.classroomService.getPublicClassrooms();
      res.status(200).json(publicClassrooms);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch public classrooms" });
    }
  }
  async joinClassroom(req: Request, res: Response) {
    try {
        const { classroomId } = req.params;
        const userId = req.userId; // Extracted from middleware

        if (!classroomId || !userId) {
            return res.status(400).json({ error: "Classroom ID and User ID are required." });
        }

        // Attempt to join the classroom
        const updatedClassroom = await this.classroomService.joinClassroom(classroomId, userId);

        res.status(200).json({ message: "Successfully joined classroom", classroom: updatedClassroom });
    } catch (error) {
        const err = error as Error;
        res.status(500).json({ error: err.message || "Failed to join classroom." });
    }
}

  
}

