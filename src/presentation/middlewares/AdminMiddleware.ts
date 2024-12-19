import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.adminToken || req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (!decoded) {
      return res.status(403).json({ error: "Forbidden" });
    }
    // req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
