// middleware/isAdmin.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  email: string;
  role: string;
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.adminToken;
      console.log(token,"admintoken")
    if (!token) {
      return res.status(401).json({ 
        error: "Access denied. No admin token provided" 
      });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      // Check if the token belongs to an admin
      if (decoded.role !== "admin") {
        return res.status(403).json({ 
          error: "Access denied. Not an admin" 
        });
      }

      // Check if email matches admin email
      if (decoded.email !== "admin@example.com") {
        return res.status(403).json({ 
          error: "Access denied. Invalid admin credentials" 
        });
      }

      // Token is valid and user is admin
      next();
    } catch (error) {
      // Token verification failed
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ 
          error: "Admin token has expired" 
        });
      }

      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ 
          error: "Invalid admin token" 
        });
      }

      return res.status(401).json({ 
        error: "Invalid admin token" 
      });
    }
  } catch (error) {
    console.error("Error in admin middleware:", error);
    return res.status(500).json({ 
      error: "Internal server error" 
    });
  }
};