import { Request, Response, NextFunction } from "express";
import { User as UserModel } from "../../infrastructure/databse/models/UserModel";

export const checkIfBlocked = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ message: "User ID not found in request" });
        }

        // Check if user exists and is blocked
        const user = await UserModel.findById(userId);
        console.log(user,"user is there ..")
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isBlocked) {
            return res.status(406).json({ 
                message: "Access denied: Your account has been blocked. Please contact support for assistance." 
            });
        }

        next();
    } catch (error) {
        console.error("Error in checkIfBlocked middleware:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

