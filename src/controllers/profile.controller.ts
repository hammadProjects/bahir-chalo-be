import { Request, Response, NextFunction } from "express";
import * as profileService from "../services/profile.service";
import { studentProfileSchema } from "../schemas/profile.schema";
import { CustomError } from "../middlewares/error";

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req.user;
    if (loggedInUser?.role != "student" && loggedInUser?.role != "consultant")
      throw new CustomError("You are not authenticated to view profile", 403);

    let user = {
      profilePicture: loggedInUser?.profilePicture,
      username: loggedInUser?.username,
      email: loggedInUser?.email,
      role: loggedInUser?.role,
    };

    if (loggedInUser?.role === "student") {
      return res.status(200).json({
        success: true,
        data: {
          user: { ...user, studentProfile: loggedInUser?.studentProfile },
        },
      });
    } else {
      return res.status(200).json({
        success: true,
        data: {
          user: { ...user, consultantProfile: loggedInUser?.consultantProfile },
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

export const updateStudentProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = studentProfileSchema.safeParse(req.body);
    if (!result.success)
      throw new CustomError(String(result.error?.message), 400);

    const data = await profileService.updateStudentProfile(
      req.user!,
      result.data
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateConsultantProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = studentProfileSchema.safeParse(req.body);
    if (!result.success)
      throw new CustomError(String(result.error?.message), 400);

    const data = await profileService.updateConsultantProfile(
      req.user!,
      req.body.bio
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
