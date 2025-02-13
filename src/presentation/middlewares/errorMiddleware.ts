import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { message, statusCode } = err as AppError;

  if (!statusCode) statusCode = 500;
  if (!message) message = "Something went wrong!";

  console.error(`Error: ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
  });
};
