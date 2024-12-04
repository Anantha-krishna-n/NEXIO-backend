"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const UserRepository_1 = require("../../infrastructure/repositories/UserRepository");
const UserService_1 = require("../../services/UserService");
const repository = new UserRepository_1.UserRepository();
const auth = new UserService_1.UserService(repository);
const controller = new authController_1.authController(auth);
const router = express_1.default.Router();
// router.get("/",(req: Request, res: Response, next: NextFunction)=>{
//     return res
//     .status(409)
//     .json({ error: "Verification Link Already Sent" })
// })
// router.post("/signup", controller.onRegisterUser.bind(controller) as any);
// // router.post(
//   "/signup", 
//   (req: Request, res: Response, next: NextFunction) => controller.onRegisterUser(req, res, next)
// )
router.post("/signup", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield controller.onRegisterUser(req, res, next);
}));
// router.post("/signup", controller.onRegisterUser.bind(controller) as any);
exports.default = router;
