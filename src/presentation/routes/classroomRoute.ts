import express, { NextFunction, Request, Response } from "express"

import { ClassroomController } from "../controllers/classroomController"
import { ClassroomRepository } from "../../infrastructure/repositories/ClassroomRepository"
import { ClassroomService } from "../../services/ClassroomSerivice"


const repository=new ClassroomRepository()
const classroom=new ClassroomService(repository)
const controller=new ClassroomController(classroom)
const router = express.Router() 

