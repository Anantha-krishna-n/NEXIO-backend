import express, { NextFunction, Request, Response } from "express"
import {authController} from "../controllers/authController"
import { UserRepository } from "../../infrastructure/repositories/UserRepository"
import { UserService } from "../../services/UserService"
import {refreshTokenHandler } from "../middlewares/TokenMiddleware"
import {checkIfBlocked} from "../middlewares/userValidate"

const repository = new UserRepository()
const auth = new UserService(repository)
const controller = new authController(auth)
const router = express.Router() 

router.post("/signup", controller.onRegisterUser.bind(controller) );

router.post('/verify',controller.onVerifyUser.bind(controller))
router.post('/resend-otp',controller.onResendOTP.bind(controller))

router.post('/login',controller.onLoginUser.bind(controller));
router.post('/logout',controller.onLogoutUser.bind(controller))


export default router;


