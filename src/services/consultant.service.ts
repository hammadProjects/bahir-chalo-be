import { getVerifiedConsultantIdQuery } from "../models/consultant.schema";
import User from "../models/user.model";
import { SAFE_USER_SELECT } from "../utils/utils";

export const getVerifiedConsultants = async ({
  search,
  limit,
  page,
}: getVerifiedConsultantIdQuery) => {
  const skip = (page - 1) * limit;

  // count total consultants
  const totalConsultants = await User.countDocuments({
    role: "consultant",
    "consultantProfile.status": "approved",
    $or: [
      { username: { $regex: search, $options: "i" } },
      { "consultantProfile.bio": { $regex: search, $options: "i" } },
    ],
  });

  const consultants = await User.find({
    role: "consultant",
    "consultantProfile.status": "approved",
    $or: [
      { username: { $regex: search, $options: "i" } },
      { "consultantProfile.bio": { $regex: search, $options: "i" } },
    ],
  })
    .select(SAFE_USER_SELECT)
    .lean()
    .skip(skip)
    .limit(limit);

  return { consultants, totalConsultants, page, limit };
};
