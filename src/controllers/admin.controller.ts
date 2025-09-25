import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { CustomError } from "../middlewares/error";
import { SAFE_USER_SELECT } from "../utils/utils";

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
      throw new CustomError(
        "Invalid status: status allowed['approved', 'rejected']",
        400
      );

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

export const getPendingConsultants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const consultants = await User.find({
      role: "consultant",
      "consultantProfile.status": "pending",
    })
      .select(
        SAFE_USER_SELECT
        // exclude all of the fields as they are not intended to shown
      )
      .lean(); // when dont want to include methods

    // filtered in db

    // const pendingConsultants = consultants.filter(
    //   (consultant) => consultant.consultantProfile.status == "pending"
    // );

    res.status(200).json({
      success: true,
      message: "Pending consultants fetched",
      data: { consultants },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllConsultants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const consultants = await User.find({
      role: "consultant",
      "consultantProfile.status": { $ne: "pending" },
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
