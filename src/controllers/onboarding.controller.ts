import { NextFunction, Request, Response } from "express";
import { CustomError } from "../middlewares/error";
import {
  consultantOnboardingBody,
  studentOnboardingBody,
} from "../schemas/onboarding.schema";

export const studentOnboarding = async (
  req: Request<{}, {}, studentOnboardingBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req.user!;
    if (loggedInUser.role != "unassigned")
      throw new CustomError("Bad Request", 400);

    const { recentDegree, grades, homeCountry, ieltsScore, budget, courses } =
      req.body;

    loggedInUser.role = "student";
    loggedInUser.studentProfile = {
      recentDegree,
      grades,
      homeCountry,
      ieltsScore,
      budget,
      courses,
    };
    await loggedInUser.save();

    res.status(200).json({
      success: true,
      message: "You are successfully Registered as Student",
    });
  } catch (error) {
    next(error);
  }
};

export const consultantOnboarding = async (
  req: Request<{}, {}, consultantOnboardingBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bio, certificateUrl, experience } = req.body;
    if (experience <= 0)
      throw new CustomError("Experience must be atleast 1 Year", 400);
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
      experience,
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
