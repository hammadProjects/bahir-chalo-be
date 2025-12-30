import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { CustomError } from "../middlewares/error";
import { SAFE_USER_SELECT } from "../utils/utils";
import {
  getVerifiedConsultantQuerySchema,
  getConsultantByIdParams,
  getConsultantByIdParamsSchema,
  getVerifiedConsultantIdQuery,
} from "../models/consultant.schema";
import * as consultatService from "../services/consultant.service";

export const getVerifiedConsultants = async (
  req: Request<{}, getVerifiedConsultantIdQuery, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = getVerifiedConsultantQuerySchema.safeParse(req.query);
    if (!result.success)
      throw new CustomError(String(result.error?.message), 400);

    const { consultants, totalConsultants, page, limit } =
      await consultatService.getVerifiedConsultants(result?.data);

    res.status(200).json({
      success: true,
      message: "Consultants Fetched Successfuly",
      data: {
        pagination: {
          consultants,
          totalConsultants,
          hasNext: page < Math.ceil(totalConsultants / limit),
          hasPrev: page > 1,
          currentPage: page,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const validateStatus = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req.user;

    if (loggedInUser?.role != "consultant")
      throw new CustomError("only consultants can view status", 401);

    res.json({
      success: true,
      message: "status fetched successfully",
      status: loggedInUser?.consultantProfile?.status,
    });
  } catch (error) {
    next(error);
  }
};

export const getConsultantById = async (
  req: Request<getConsultantByIdParams, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = getConsultantByIdParamsSchema.safeParse(req.params);
    if (!result.success)
      throw new CustomError(String(result.error?.message), 400);

    const { id: consultantId } = result.data;

    const data = await User.findById(consultantId).select(SAFE_USER_SELECT);
    if (!data) new CustomError("Invalid Id. Consultant does not exist", 404);

    return res.status(200).json({
      success: true,
      message: "Consultant Fetched Successfully",
      data: {
        consultant: data,
      },
    });
  } catch (error) {
    next(error);
  }
};
