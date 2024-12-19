import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import bcrypt from "bcryptjs";



export const ADMIN_CREDENTIALS = {
    email: "admin@example.com",
    password: "Admin@123", 
  };
  
const userRepository = new UserRepository();
export class adminController{
    async adminLogin(req:Request,res:Response){
        const {email,password}=req.body;
        if (email !== ADMIN_CREDENTIALS.email || !(await bcrypt.compare(password, ADMIN_CREDENTIALS.password))) {
            return res.status(401).json({ error: "Invalid email or password" });
          }
          const token = jwt.sign({ email, role: "admin" }, process.env.JWT_SECRET!, { expiresIn: "1d" });
          res.cookie("adminToken", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
          });
          return res.json({ message: "Admin logged in successfully",  })
    }
}