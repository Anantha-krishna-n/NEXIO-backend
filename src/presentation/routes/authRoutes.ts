import express, { NextFunction, Request, Response } from "express"
import {authController} from "../controllers/authController"
import { UserRepository } from "../../infrastructure/repositories/UserRepository"
import { UserService } from "../../services/UserService"
import {refreshTokenHandler } from "../middlewares/TokenMiddleware"

const repository = new UserRepository()
const auth = new UserService(repository)
const controller = new authController(auth)
const router = express.Router() 
// router.get("/",(req: Request, res: Response, next: NextFunction)=>{
//     return res
//     .status(409)
//     .json({ error: "Verification Link Already Sent" })
// })
// router.post("/signup", controller.onRegisterUser.bind(controller) );
// // router.post(
//   "/signup", 
//   (req: Request, res: Response, next: NextFunction) => controller.onRegisterUser(req, res, next)
// )
router.post(
  "/signup", 
  async (req: Request, res: Response, next: NextFunction) => {
    await controller.onRegisterUser(req, res, next);
  }
);
router.post(
  "/verify",
  async (req: Request, res: Response, next: NextFunction) => {
    await controller.onVerifyUser(req, res, next);
  }
);

router.post(
  "/resend-otp",
  async (req: Request, res: Response, next: NextFunction) => {
    await controller.onResendOTP(req, res, next);
  }
);
router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    await controller.onLoginUser(req, res, next);
  }
);
router.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    await controller.onLogoutUser(req, res, next);
  }
);


export default router;


