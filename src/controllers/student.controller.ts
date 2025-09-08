import { NextFunction, Request, Response } from "express";
import { CustomError } from "../middlewares/error";

export const studentOnboarding = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req.user!;
    if (loggedInUser.role != "unassigned")
      throw new CustomError("Bad Request", 400);

    loggedInUser.role = "student";
    await loggedInUser.save();

    res
      .status(200)
      .json({
        success: true,
        message: "You are successfully Registered as Student",
      });
  } catch (error) {
    next(error);
  }
};
