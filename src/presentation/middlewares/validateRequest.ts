import { z } from "zod";
import { RequestHandler } from "express";

export const validateRequest =
  (schema: z.ZodSchema<any>): RequestHandler =>
  (req, res, next) => {
    try {
      console.log("data got from signUp tab",req.body)
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(422).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  }


//   import { Request, Response, NextFunction } from "express";
// import { userValidator } from "../validators/userValidator"; // Import your validator

// export const validateUserInput = (req: Request, res: Response, next: NextFunction) => {
//   try {
//     // Validate the request body
//     userValidator.parse(req.body);
//     next(); // Proceed to the next middleware/controller
//   } catch (error) {
//     res.status(400).json({ error: error.errors }); // Send validation errors
//   }
// };
