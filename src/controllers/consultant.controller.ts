import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { CustomError } from "../middlewares/error";
import { SAFE_USER_SELECT } from "../utils/utils";

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

    loggedInUser.consultantProfile = {
      bio,
      certificateUrl,
      status: "pending",
      // will be verified by admin - just to ensure ts is error free (as it is required to enter status)
    };

    loggedInUser.role = "consultant";
    await loggedInUser.save();
    res
      .status(200)
      .json({ success: true, message: "Your Profile has been updated!" });
  } catch (error) {
    next(error);
  }
};

export const getVerifiedConsultants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const consultants = await User.find({
      role: "consultant",
      "consultantProfile.status": "approved",
    })
      .select(SAFE_USER_SELECT)
      .lean();

    // (todo) - get by pagination
    res.status(200).json({
      success: true,
      message: "Consultants Fetched Successfuly",
      data: { consultants },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getConsultantById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const data = await User.findById(id);
    if (!data) new CustomError("Invalid Id. Consultant does not exist", 404);

    return res.status(200).json({
      success: true,
      message: "Consultant Fetched Successfully",
      data: { consultant: data },
    });
  } catch (error) {
    next(error);
  }
};
