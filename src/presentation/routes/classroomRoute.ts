import express, { NextFunction, Request, Response } from "express"

import { ClassroomController } from "../controllers/classroomController"
import { ClassroomRepository } from "../../infrastructure/repositories/ClassroomRepository"
import { ClassroomService } from "../../services/ClassroomSerivice"
import { refreshTokenHandler } from "../middlewares/TokenMiddleware"
import {checkIfBlocked} from "../middlewares/userValidate"


const repository=new ClassroomRepository()
const classroom=new ClassroomService(repository)
const controller=new ClassroomController(classroom)
const router = express.Router() 

router.post('/createroom',refreshTokenHandler,checkIfBlocked,controller.createClassroom.bind(controller))
router.get('/public', controller.getPublicClassrooms.bind(controller))
router.get('/user/private', refreshTokenHandler,controller.getUserCreatedPrivateClassrooms.bind(controller));


router.post('/joinClassroom/:classroomId', refreshTokenHandler,checkIfBlocked, controller.joinClassroom.bind(controller));
router.get('/:classroomId', refreshTokenHandler, controller.getClassroomById.bind(controller));

  export default router;