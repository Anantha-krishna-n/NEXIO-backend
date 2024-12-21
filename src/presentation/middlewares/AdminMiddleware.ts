import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyAdminToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.adminToken;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string; role: string; exp: number };

    if (decoded.role !== "admin" || decoded.email !== "admin@example.com") {
      return res.status(403).json({ error: "Forbidden: Invalid admin credentials" });
    }
    const currentTime = Math.floor(Date.now() / 1000);
    const timeToExpiry = decoded.exp - currentTime;

    if (timeToExpiry < 5 * 60) {
      const newToken = jwt.sign({ email: decoded.email, role: decoded.role }, process.env.JWT_SECRET!, {
        expiresIn: "1d",
      });
      res.cookie("adminToken", newToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
    next(); 
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: "Unauthorized: Token expired" });
    }
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
