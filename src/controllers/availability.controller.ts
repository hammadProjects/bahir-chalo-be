import { NextFunction, Request, Response } from "express";
import { CustomError } from "../middlewares/error";
import Availability from "../models/availability.model";

export const setAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.user!;
    const { startTime, endTime } = req.body;

    if (startTime <= Date.now() || endTime <= Date.now())
      throw new CustomError("Availability Time is Invalid", 400);

    if (startTime >= endTime)
      throw new CustomError("Availability Time is Invalid", 400);

    const availData = await Availability.create({
      consultantId: _id,
      startTime,
      endTime,
    });
    res.status(201).json({
      success: true,
      message: "Availability Created",
      data: availData,
    });
  } catch (error) {
    next(error);
  }
};
