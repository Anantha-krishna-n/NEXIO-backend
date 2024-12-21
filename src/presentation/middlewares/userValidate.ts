import { Request, Response, NextFunction } from "express";
// import UserModel from "../infrastructure/database/models/UserModel"; 
import {User as UserModel } from "../../infrastructure/databse/models/UserModel"

 export const checkIfBlocked = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId
        if (!userId) {
            return res.status(400).json({ message: "User ID not found" });
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.isBlocked) {
            return res.status(403).json({ message: "Access denied: User is blocked" });
        }
        next();
    } catch (error) {
        console.error("Error checking user block status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

