import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { SAFE_USER_SELECT } from "../utils/utils";
import * as AdminService from "../services/admin.service";
import {
  verifyConsultantBody,
  verifyConsultantParams,
} from "../schemas/admin.schema";

export const verifyConsultant = async (
  req: Request<verifyConsultantParams, {}, verifyConsultantBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await AdminService.verifyConsultant({ id, status });

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
      .select(SAFE_USER_SELECT)
      .lean();

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
    // console.log(error);
    next(error);
  }
};
