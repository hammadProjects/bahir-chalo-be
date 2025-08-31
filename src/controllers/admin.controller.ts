import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { CustomError } from "../middlewares/error";

export const verifyConsultant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params; // id of consultant to be approved or rejected
    const { status } = req.body;

    // (todo) - verify status method in consultant schema
    if (status !== "approved" && status !== "rejected")
      throw new CustomError("Invalid status", 400);

    const findConsultant = await User.findById(id); // finding consultant
    if (!findConsultant) throw new CustomError("User Not Found", 404);

    if (!findConsultant.consultantProfile)
      throw new CustomError("User is Not Consultant", 400);

    const { status: prevStatus } = findConsultant.consultantProfile;
    if (prevStatus != "pending")
      throw new CustomError(`User is already ${prevStatus}`, 400);

    findConsultant.consultantProfile.status = status;
    await findConsultant.save();

    // (todo) send an email - according to the status
    res
      .status(200)
      .json({ success: true, message: `The Consultant is ${status}` });
  } catch (error) {
    next(error);
  }
};
