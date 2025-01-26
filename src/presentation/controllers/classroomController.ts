import { Request, Response } from "express";

import { ClassroomService } from "../../services/ClassroomSerivice";
import jwt from "jsonwebtoken";
import { error } from "console";
import { Mailer } from "../../external/Mailer";
import { HttpStatusCode } from "../utils/HttpStatusCode";
import {
  ErrorMessages,
  SuccessMessages,
  GenericMessages,
} from "../utils/Constants";

export class ClassroomController {
  private classroomService: ClassroomService;

  constructor(classroomService: ClassroomService) {
    this.classroomService = classroomService;
  }

  async createClassroom(req: Request, res: Response) {
    try {
      console.log("Entered into classroom");
      const { title, description, date, time, type } = req.body;
      const adminId = req.userId;
      console.log(adminId, "adminId ");

      if (!title || !date || !time) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ error: ErrorMessages.REQUIRED_FIELDS });
      }
      const classroom = await this.classroomService.createClassroom(
        title,
        description,
        new Date(date),
        time,
        type,
        adminId as string
      );
      console.log("classroom", classroom);
      res
        .status(HttpStatusCode.CREATED)
        .json({ message: SuccessMessages.CLASSROOM_CREATED, classroom });
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: ErrorMessages.FAILED_TO_CREATE_CLASSROOM });
    }
  }

  async getPublicClassrooms(req: Request, res: Response) {
    try {
      const publicClassrooms =
        await this.classroomService.getPublicClassrooms();

      const filteredClassrooms = publicClassrooms.filter(
        (classroom) => classroom.type === "public"
      );

      const randomClassrooms = filteredClassrooms
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);

      res.status(HttpStatusCode.OK).json(randomClassrooms);
    } catch (error) {
      console.error("Error fetching public classrooms:", error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: ErrorMessages.FAILED_TO_FETCH_PUBLIC_CLASSROOMS });
    }
  }

  async joinClassroom(req: Request, res: Response) {
    try {
      const { classroomId } = req.params;
      const userId = req.userId;

      if (!classroomId || !userId) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ error: ErrorMessages.REQUIRED_FIELDS });
      }

      const updatedClassroom = await this.classroomService.joinClassroom(
        classroomId,
        userId
      );

      res.status(HttpStatusCode.OK).json({
        message: SuccessMessages.JOINED_CLASSROOM,
        classroom: updatedClassroom,
      });
    } catch (error) {
      const err = error as Error;
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: err.message || ErrorMessages.FAILED_TO_JOIN_CLASSROOM });
    }
  }

  async getClassroomById(req: Request, res: Response): Promise<void> {
    try {
      const { classroomId } = req.params;

      const classroom = await this.classroomService.getClassroomById(
        classroomId
      );
      if (!classroom) {
        res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ message: ErrorMessages.CLASSROOM_NOT_FOUND });
        return;
      }

      res
        .status(HttpStatusCode.OK)
        .json({ message: SuccessMessages.CLASSROOM_FETCHED, classroom });
    } catch (error) {
      const err = error as Error;
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({
          message: ErrorMessages.FAILED_TO_FETCH_CLASSROOM_MEMBERS,
          error: err.message,
        });
    }
  }
  async getUserCreatedPrivateClassrooms(req: Request, res: Response) {
    try {
      const adminId = req.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = 3;

      if (!adminId) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ error: ErrorMessages.REQUIRED_FIELDS });
      }

      const { classrooms, total } =
        await this.classroomService.getPrivateClassroomsCreatedByUser(
          adminId,
          page,
          limit
        );

      res.status(HttpStatusCode.OK).json({
        classrooms,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      });
    } catch (error) {
      console.error("Error fetching private classrooms:", error);
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: ErrorMessages.FAILED_TO_FETCH_PRIVATE_CLASSROOMS });
    }
  }
  async joinClassroomByInvite(req: Request, res: Response) {
    try {
      console.log("Entered into the controller for join by invite");
      const { inviteCode } = req.params;
      const userId = req.userId;

      console.log("Join request:", { inviteCode, userId });

      if (!inviteCode || !userId) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ error: ErrorMessages.REQUIRED_FIELDS });
      }

      const classroom = await this.classroomService.validateInviteCode(
        inviteCode
      );

      if (!classroom) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ error: ErrorMessages.INVALID_INVITE_CODE });
      }

      const classroomId = classroom._id.toString();
      const updatedClassroom = await this.classroomService.joinClassroom(
        classroomId,
        userId,
        true
      );

      res.status(HttpStatusCode.OK).json({
        message: SuccessMessages.JOINED_CLASSROOM,
        classroom: updatedClassroom,
      });
    } catch (error) {
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: ErrorMessages.FAILED_TO_JOIN_CLASSROOM });
    }
  }
  async getClassroomMembers(req: Request, res: Response) {
    try {
      const { roomId } = req.params;
      const userId = req.userId;
      console.log(userId, "privateroom");
      if (!roomId) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ error: ErrorMessages.REQUIRED_CLASSROOM_ID });
      }

      const members = await this.classroomService.getClassroomMembers(
        roomId,
        userId as string
      );

      res
        .status(HttpStatusCode.OK)
        .json({ message: SuccessMessages.MEMBERS_FETCHED, members });
    } catch (error) {
      const err = error as Error;
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        error: err.message || ErrorMessages.FAILED_TO_FETCH_CLASSROOM_MEMBERS,
      });
    }
  }
  async inviteUserToClassroom(req: Request, res: Response) {
    try {
      const {classroomId}=req.params;
      const {  email } = req.body;
  console.log(classroomId,"classroom")
  console.log(email,"email")
      if (!classroomId || !email) {
        return res
          .status(HttpStatusCode.BAD_REQUEST)
          .json({ error: ErrorMessages.REQUIRED_CLASSROOM_ID_AND_EMAIL });
      }
  
      const inviteLink = await this.classroomService.getClassroomInviteLink(classroomId);
  
      if (!inviteLink) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ error: ErrorMessages.CLASSROOM_NOT_FOUND });
      }
  
      const mailer = new Mailer();
      await mailer.SendEmail(email, { type: "invite", value: inviteLink });
  
      res.status(HttpStatusCode.OK).json({ message: SuccessMessages.INVITATION_SENT(email) });
    } catch (error) {
      const err = error as Error;
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: err.message || ErrorMessages.FAILED_TO_SEND_INVITE });
    }
  }
  

  async joinClassroomWithInvite(req: Request, res: Response) {
    try {
      const { inviteCode } = req.params;
      
      const classroom = await this.classroomService.validateInviteCode(inviteCode);
      
      if (!classroom) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ error: ErrorMessages.INVALID_INVITE_CODE });
      }
      if (!req.userId) {
        const returnUrl = `/classroom/join/invite/${inviteCode}/${classroom._id}`;
        return res.redirect(`${process.env.CLIENT_URL}/login?returnUrl=${encodeURIComponent(returnUrl)}`);
      }
  
      res.redirect(`/classroom/${classroom._id}`);
    } catch (error) {
      const err = error as Error;
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: err.message || ErrorMessages.FAILED_TO_JOIN_CLASSROOM });
    }
  }
  async validateInviteCode(req: Request, res: Response) {
    try {
      const { inviteCode } = req.params;
      const userId=req.userId
      const classroom = await this.classroomService.validateInviteCode(inviteCode);
      
      if (!classroom) {
        return res
          .status(HttpStatusCode.NOT_FOUND)
          .json({ error: ErrorMessages.INVALID_INVITE_CODE });
      }
  
      const classroomId = classroom._id.toString();
      const updatedClassroom = await this.classroomService.joinClassroom(
        classroomId,
        userId as string,
        true
      );
      res.status(HttpStatusCode.OK).json({ 
        message: SuccessMessages.INVITE_CODE_VALID,
        classroom :updatedClassroom
      });
    } catch (error) {
      const err = error as Error;
      res
        .status(HttpStatusCode.INTERNAL_SERVER_ERROR)
        .json({ error: err.message || ErrorMessages.FAILED_TO_VALIDATE_INVITE });
    }
  }
}