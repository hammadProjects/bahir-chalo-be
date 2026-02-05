import { CustomError } from "../middlewares/error";
import User from "../models/user.model";
import { studentProfile } from "../schemas/profile.schema";
import { UserDocument } from "../utils/types";

export const updateProfileImage = async (user: UserDocument, image: string) => {
  user.profilePicture = image;
  await user.save();

  return { image: user.profilePicture };
};

export const updateStudentProfile = async (
  user: UserDocument,
  data: studentProfile
) => {
  if (user.role !== "student")
    throw new CustomError("Only students can update this profile", 403);

  user.profilePicture = data.profilePicture
    ? data.profilePicture
    : user.profilePicture;

  await user.save();
  return user;
};

export const updateConsultantProfile = async (
  user: UserDocument,
  bio: string
) => {
  if (user.role !== "consultant")
    throw new CustomError("Only consultants can update this profile", 403);

  user.consultantProfile.bio = bio;

  await user.save();
  return user;
};
