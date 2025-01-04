import express, { NextFunction, Request, Response } from "express"
import {authController} from "../controllers/authController"
import { UserRepository } from "../../infrastructure/repositories/UserRepository"
import { UserService } from "../../services/UserService"
import {refreshTokenHandler } from "../middlewares/TokenMiddleware"
import {checkIfBlocked} from "../middlewares/userValidate"
import passport from "passport"
import { Check } from "../middlewares/Checking"

const repository = new UserRepository()
const auth = new UserService(repository)
const controller = new authController(auth)
const router = express.Router() 
const logMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log(`Route hit: ${req.method} ${req.originalUrl}`);
  next(); 
};

router.post("/signup", controller.onRegisterUser.bind(controller) );

router.post('/verify',controller.onVerifyUser.bind(controller))
router.post('/resend-otp',controller.onResendOTP.bind(controller))
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get(
  '/google/callback',logMiddleware,
  passport.authenticate('google', { session: false }),
  controller.authCallbackController.bind(controller)
);
router.get("/users/me", refreshTokenHandler, controller.onUserFind.bind(controller));
router.patch("/updateProfile",refreshTokenHandler,controller.updateUserDetails.bind(controller))
router.post('/login',controller.onLoginUser.bind(controller));
router.post('/logout',controller.onLogoutUser.bind(controller))

export default router;


