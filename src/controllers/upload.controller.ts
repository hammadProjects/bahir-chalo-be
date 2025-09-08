import { NextFunction, Request, Response } from "express";
import { CustomError } from "../middlewares/error";

export const uploadSingleFile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) throw new CustomError("No file uploaded", 400);

    const fileUrl = req.file.path;
    res.status(200).json({
      success: true,
      message: "File Uploaded Successfully",
      url: fileUrl,
    });
  } catch (error) {
    next(error);
  }
};
