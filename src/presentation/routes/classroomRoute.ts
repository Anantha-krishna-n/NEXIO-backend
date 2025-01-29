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
// router.get('/count',refreshTokenHandler,controller.getUserClassrooms.bind(controller))

router.post('/joinClassroom/:classroomId', refreshTokenHandler,checkIfBlocked, controller.joinClassroom.bind(controller));
router.get('/:classroomId', refreshTokenHandler, controller.getClassroomById.bind(controller));
router.post( '/join/invite/:inviteCode',refreshTokenHandler,controller.joinClassroomByInvite.bind(controller))
router.get('/:roomId/members', refreshTokenHandler, controller.getClassroomMembers.bind(controller));
router.post('/:classroomId/invite', refreshTokenHandler, checkIfBlocked, controller.inviteUserToClassroom.bind(controller));
router.get('/invite/:inviteCode', controller.joinClassroomWithInvite.bind(controller));
router.get('/validate-invite/:inviteCode', controller.validateInviteCode.bind(controller));
  export default router;
