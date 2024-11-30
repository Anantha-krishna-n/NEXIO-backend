import express from "express"
import {authController} from "../controllers/authController"
import { UserRepository } from "../../infrastructure/repositories/UserRepository"
import { UserService } from "../../services/UserService"


const repository = new UserRepository()
const auth = new UserService(repository)
const controller = new authController(auth)
const router = express.Router()

router.post(
  "/signup",
  controller.onRegisterUser.bind(controller)
)
export default router;