import { NextFunction, Request, Response } from "express";
import * as onboardingSchema from "../schemas/onboarding.schema";
import * as onboardingService from "../services/onboarding.service";
export const studentOnboarding = async (
  req: Request<{}, {}, onboardingSchema.studentOnboardingBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    await onboardingService.studentOnboarding(req.user!, req.body);

    res.status(200).json({
      success: true,
      message: "You are successfully Registered as Student",
    });
  } catch (error) {
    next(error);
  }
};

export const consultantOnboarding = async (
  req: Request<{}, {}, onboardingSchema.consultantOnboardingBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    await onboardingService.consultantOnboarding(req.user!, req.body);

    res
      .status(200)
      .json({ success: true, message: "Your Profile has been updated!" });
  } catch (error) {
    next(error);
  }
};
