import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { ClassroomRepository } from "../../infrastructure/repositories/ClassroomRepository";
import { IUserAuth } from "../../interfaces/repositories/IUserAuth";
import bcrypt from "bcryptjs";



export const ADMIN_CREDENTIALS = {
    email: "admin@example.com",
    password: "Admin@123", 
  };
const userRepository = new UserRepository();
const classroomRepository=new ClassroomRepository();
export class adminController{
  
    async adminLogin(req:Request,res:Response){
        const {email,password}=req.body;
      
        if (email !==ADMIN_CREDENTIALS.email || password !==ADMIN_CREDENTIALS.password){
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
    async getAllUsers(req: Request, res: Response) {
      try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
    
        if (page <= 0 || limit <= 0) {
          return res.status(400).json({ error: "Invalid page or limit value" });
        }
        const { users, total } = await userRepository.getAllUsers(page, limit);
       console.log(users,"admn")
        res.status(200).json({
          users,
          totalUsers: total,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
        });
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
      }
    }
    async adminLogout(req: Request, res: Response) {
      try {
        console.log("here in the admin")
        res.clearCookie("adminToken", {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        });
  
        return res.status(200).json({ message: "Admin logged out successfully" });
      } catch (error) {
        console.error("Error in adminLogout:", error);
        return res.status(500).json({ error: "Failed to log out admin" });
      }
    }
    async toggleUserBlockStatus(req: Request, res: Response) {
      try {
          const userId = req.params.id;
          const { isBlocked } = req.body;
  
          // Validate userId
          if (!userId) {
              return res.status(400).json({ error: "User ID is required" });
          }
  
          // Check if user exists
          const existingUser = await userRepository.findById(userId);
          if (!existingUser) {
              return res.status(404).json({ error: "User not found" });
          }
  
          // Toggle block status
          const updatedUser = await userRepository.toggleBlockStatus(userId, isBlocked);
           console.log(updatedUser,"admin")
          // Send response
          res.status(200).json({
              message: `User has been ${isBlocked ? "blocked" : "unblocked"} successfully`,
              user: updatedUser,
          });
           
      } catch (error) {
          console.error("Error in toggleUserBlockStatus:", error);
          res.status(500).json({ error: "Failed to update user status" });
      }
  }
  async getClassroomStats(req: Request, res: Response) {
    try {
        const stats = await classroomRepository.getClassroomCountsPerMonth();
        res.status(200).json(stats);
    } catch (error) {
        console.error("Error fetching classroom statistics:", error);
        res.status(500).json({ error: "Failed to fetch classroom statistics" });
    }
}

}