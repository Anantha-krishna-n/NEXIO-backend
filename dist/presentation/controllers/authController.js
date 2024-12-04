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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
// const userService = new UserService();
class authController {
    constructor(authService) {
        this.authService = authService;
    }
    onRegisterUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const { name, email, password, confirmpassword } = req.body;
                const existingUser = yield this.authService.findUserByEmail(body.email);
                if (existingUser) {
                    if (existingUser.verified) {
                        return res
                            .status(409)
                            .json({ error: "Verification Link Already Sent" });
                    }
                    return res
                        .status(409)
                        .json({ error: "User Already Exists with Given Email" });
                }
                if (password !== confirmpassword) {
                    return res.status(400).json({ error: "Passwords Don't Match" });
                }
                const data = yield this.authService.registerUser(name, email, password);
                return res.json(data);
            }
            catch (error) {
                console.error("Error on registration:", error);
                next(error);
            }
        });
    }
}
exports.authController = authController;
