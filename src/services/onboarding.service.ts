import { CustomError } from "../middlewares/error";
import * as OnboardingSchema from "../schemas/onboarding.schema";
import { UserDocument } from "../utils/types";

export const studentOnboarding = async (
  user: UserDocument,
  {
    recentDegree,
    grades,
    homeCountry,
    ieltsScore,
    budget,
    courses,
  }: OnboardingSchema.studentOnboardingBody
) => {
  if (user.role != "unassigned") throw new CustomError("Bad Request", 400);

  user.role = "student";
  user.studentProfile = {
    recentDegree,
    grades,
    homeCountry,
    ieltsScore,
    budget,
    courses,
  };
  await user.save();
};

export const consultantOnboarding = async (
  user: UserDocument,
  { bio, certificateUrl, experience }: OnboardingSchema.consultantOnboardingBody
) => {
  if (user.role != "unassigned")
    throw new CustomError(`You are already been assigned as ${user.role}`, 400);

  user.consultantProfile = {
    bio,
    certificateUrl,
    experience,
    status: "pending",
  };

  user.role = "consultant";
  await user.save();
};
