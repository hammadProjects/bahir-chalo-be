import { CustomError } from "../middlewares/error";
import User from "../models/user.model";
import {
  verifyConsultantBody,
  verifyConsultantParams,
} from "../schemas/admin.schema";
import { sendEmail } from "../utils/email";

export const verifyConsultant = async ({
  status,
  id: consultantId,
}: verifyConsultantBody & verifyConsultantParams) => {
  // (todo) - verify status method in consultant schema
  if (status !== "approved" && status !== "rejected")
    throw new CustomError(
      "Invalid status: status allowed['approved', 'rejected']",
      400
    );

  const findConsultant = await User.findById(consultantId);
  if (!findConsultant) throw new CustomError("User Not Found", 404);

  if (!findConsultant.consultantProfile)
    throw new CustomError("User is Not Consultant", 400);

  const { status: prevStatus } = findConsultant.consultantProfile;
  if (prevStatus != "pending")
    throw new CustomError(`User is already ${prevStatus}`, 400);

  findConsultant.consultantProfile.status = status;
  await findConsultant.save();

  // (todo) send an email - according to the status
  sendEmail(
    findConsultant?.email,
    `Bahir Chalo Account ${
      status === "rejected" ? "Rejection" : "Acceptence"
    }.`,
    `Your Baahir Chalo account have been ${
      status === "rejected" ? "Rejected" : "Accepted"
    }`
  );
};
