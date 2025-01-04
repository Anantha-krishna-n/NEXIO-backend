import { Request, Response } from "express";

import { ClassroomService } from "../../services/ClassroomSerivice";
import jwt from "jsonwebtoken";
import { error } from "console";

export class ClassroomController {
  private classroomService: ClassroomService;

  constructor(classroomService: ClassroomService) {
    this.classroomService = classroomService;
  }

  async createClassroom(req: Request, res: Response) {
    try {
    console.log("Entered into classroom")
      const { title, description, date, time, type } = req.body;
      const adminId = req.userId;
      console.log(adminId,"adminId ")
      
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
  
      const filteredClassrooms = publicClassrooms.filter(
        (classroom) => classroom.type === "public"
      );
  
      const randomClassrooms = filteredClassrooms
        .sort(() => 0.5 - Math.random()) 
        .slice(0, 5); 
  
      res.status(200).json(randomClassrooms);
    } catch (error) {
      console.error("Error fetching public classrooms:", error);
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


async getClassroomById(req: Request, res: Response): Promise<void> {
  try {
    const { classroomId } = req.params;

    const classroom = await this.classroomService.getClassroomById(classroomId);
    if (!classroom) {
      res.status(404).json({ message: "Classroom not found." });
      return;
    }

    res.status(200).json({ message: "Classroom fetched successfully.", classroom });
  } catch (error) {
    const err = error as Error
    res.status(500).json({ message: "Failed to fetch classroom.", error: err.message });
  }
}
async getUserCreatedPrivateClassrooms(req: Request, res: Response) {
  try {
    const adminId = req.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = 3; 

    if (!adminId) {
      return res.status(400).json({ error: "Admin ID is required" });
    }

    const { classrooms, total } = await this.classroomService.getPrivateClassroomsCreatedByUser(
      adminId,
      page,
      limit
    );

    res.status(200).json({
      classrooms,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (error) {
    console.error("Error fetching private classrooms:", error);
    res.status(500).json({ error: "Failed to fetch private classrooms" });
  }
}
async joinClassroomByInvite(req: Request, res: Response) {
  try {
    const { inviteCode } = req.params;
    const userId = req.userId;

    if (!inviteCode || !userId) {
      return res.status(400).json({ error: "Invite code and User ID are required." });
    }

    const classroom = await this.classroomService.joinClassroomByInvite(inviteCode, userId);

    res.status(200).json({ message: "Successfully joined classroom", classroom });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ error: err.message || "Failed to join classroom." });
  }
}


}




  


