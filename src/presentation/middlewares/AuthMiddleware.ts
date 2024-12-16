// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import {User as UserModel} from "../../infrastructure/databse/models/UserModel"

// export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ error: "Unauthorized" });
//   }

//   try {
//     const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
//     const user = await UserModel.findById(decoded.id);

//     if (!user) {
//       return res.status(401).json({ error: "User not found" });
//     }

//     req.user = user; 
//     next();
//   } catch (err) {
//     return res.status(401).json({ error: "Invalid token" });
//   }
// };
