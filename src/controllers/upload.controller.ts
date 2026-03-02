import { NextFunction, Request, Response } from "express";
import { CustomError } from "../middlewares/error";

export const uploadSingleFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) throw new CustomError("No file uploaded", 400);
    const fileUrl = req.file.path;
    req.profilePicture =
      fileUrl ||
      "https://docs.gravatar.com/wp-content/uploads/2025/02/avatar-mysteryperson-20250210-256.png";
    next();
  } catch (error) {
    next(error);
  }
};
