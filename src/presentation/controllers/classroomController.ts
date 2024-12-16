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
      const token=req.cookies?.accessToken
      if (!token) {
        return res.status(401).json({ error: "Access token is missing" });
    }
        const decoded=jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        console.log(decoded,"token")
      
      console.log("entered into controller")
      const { title, description, date, time, type } = req.body;
      const adminId = decoded.userId;
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
        adminId.toString()
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
}

