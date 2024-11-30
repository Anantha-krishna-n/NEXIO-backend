import {NextFunction, Request, Response } from "express";
import { IUserAuth } from "../../interfaces/repositories/IUserAuth";
import { User } from "../../entites/User";
import { UserService } from "../../services/UserService";
import { error } from "console";

// const userService = new UserService();


export class authController{
    private authService:IUserAuth
    constructor(authService:IUserAuth){
        this.authService=authService
    }
    async onRegisterUser(req: Request, res: Response, next: NextFunction) {
        try {
          const body: User = req.body;
          const { name, email, password, confirmpassword } = req.body;
      
          const existingUser = await this.authService.findUserByEmail(body.email);
      
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
      
          const data = await this.authService.registerUser(name, email, password);
          return res.json(data);
        } catch (error) {
          console.error("Error on registration:", error);
          next(error); 
        }
      }
      
}
