import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { CustomError } from "../middlewares/error";

export const consultantOnboarding = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bio, certificateUrl } = req.body;
    // (todo) - get the jwt from the request as headers. Make an auth middleware that stores the logged in user in the headers

    const loggedInUser = req.user!; // (!) - we are sure that loggedInUser will be available
    if (loggedInUser.role != "unassigned")
      throw new CustomError(
        `You are already been assigned as ${loggedInUser.role}`,
        400
      );

    if (!loggedInUser.consultantProfile)
      loggedInUser.consultantProfile = {
        bio,
        certificateUrl,
        status: "pending", // just to ensure ts is error free (as it is required to enter status)
      };

    await loggedInUser.save();
    res
      .status(200)
      .json({ success: true, message: "Your Profile has been updated!" });
  } catch (error) {
    next(error);
  }
};

export const getConsultants = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const consultants = User.find({
      role: "consultant",
      "consultantProfile.status": "approved",
    });
    // (todo) - get by pagination
    res.send({ success: true, data: consultants });
  } catch (error) {
    next(error);
  }
};
