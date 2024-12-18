import express, { NextFunction, Request, Response } from "express"

import { ClassroomController } from "../controllers/classroomController"
import { ClassroomRepository } from "../../infrastructure/repositories/ClassroomRepository"
import { ClassroomService } from "../../services/ClassroomSerivice"
import { refreshTokenHandler } from "../middlewares/TokenMiddleware"


const repository=new ClassroomRepository()
const classroom=new ClassroomService(repository)
const controller=new ClassroomController(classroom)
const router = express.Router() 

router.post('/createroom',refreshTokenHandler,controller.createClassroom.bind(controller))
router.get('/public', controller.getPublicClassrooms.bind(controller))

router.post('/joinClassroom/:classroomId', refreshTokenHandler, controller.joinClassroom.bind(controller));

  
  export default router;