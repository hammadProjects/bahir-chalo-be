import { NextFunction, Request, Response } from "express";
import { CustomError } from "../middlewares/error";
import Availability from "../models/availability.model";
import User from "../models/user.model";
import { Types } from "mongoose";
import {
  addDays,
  addMinutes,
  format,
  isBefore,
  isEqual,
  setHours,
  setMinutes,
} from "date-fns";
import Booking from "../models/booking.model";

export const setAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { _id } = req.user!;
    let { startTime, endTime } = req.body;

    startTime = new Date(startTime);
    endTime = new Date(endTime);

    if (isBefore(endTime, startTime) || isEqual(endTime, startTime))
      throw new CustomError("Availability Time is Invalid", 400);

    const prevAvailability = await Availability.findOne({ consultantId: _id });
    if (prevAvailability) {
      prevAvailability.startTime = startTime;
      prevAvailability.endTime = endTime;
      await prevAvailability.save();

      return res.status(201).json({
        success: true,
        message: "Availability Updated Successfully",
        data: { availability: prevAvailability },
      });
    }

    const availability = await Availability.create({
      consultantId: _id,
      startTime,
      endTime,
    });

    res.status(201).json({
      success: true,
      message: "Availability Created",
      data: { availability },
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailabilityById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const findConsultant = await User.findById(id);
    if (!findConsultant || findConsultant.role != "consultant")
      throw new CustomError("Consultant Not Found", 404);

    const availability = await Availability.find({
      consultantId: id,
      startTime: { $gte: Date.now() }, // (todo) - documents greater than or equal to current date and time
    }).sort({
      startTime: 1, // (todo) - will sort according to startTime in ascending order
    });

    if (!availability) throw new CustomError("Please Set Availability", 404);

    res.status(200).json({
      success: true,
      message: `Availability is successfully fetched`,
      data: availability,
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req.user!;
    const availability = await Availability.findOne({
      consultantId: loggedInUser._id,
      status: "Available",
    });

    if (!availability)
      throw new CustomError(
        "The consultant does not have any Availability",
        404
      );

    return res.json({
      success: true,
      message: "Availabilities Fetched Successfully",
      data: { availability },
    });
  } catch (error) {
    next(error);
  }
};

export const getAvailabilityTimeSlots = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req.user!;
    const { consultantId } = req.params;
    const bookings = await Booking.find({
      consultantId,
      status: "scheduled",
    });

    const availability = await Availability.findOne({
      consultantId,
      status: "Available",
    });

    if (!availability)
      throw new CustomError(
        "The consultant does not have any Availability",
        404
      );

    const startHours = availability.startTime.getHours();
    const startMinutes = availability.startTime.getMinutes();
    const startTime = setHours(
      setMinutes(new Date(), startMinutes),
      startHours
    );

    const endHours = availability.endTime.getHours();
    const endMinutes = availability.endTime.getMinutes();
    const days = [
      startTime,
      addDays(startTime, 1),
      addDays(startTime, 2),
      addDays(startTime, 3),
    ];

    const AvailableSlots: {
      [key: string]: {
        startTime: Date;
        endTime: Date;
        availabilityId: string;
        consultantId: string;
      }[];
    } = {};

    // isBefore gives false for same time
    for (const day of days) {
      let current = day;
      const todayEnd = setHours(setMinutes(day, endMinutes), endHours);
      const key = format(day, "eee dd");
      AvailableSlots[key] = [];

      // here we will neglect booked appointments
      while (
        isBefore(addMinutes(current, 30), todayEnd) ||
        isEqual(addMinutes(current, 30), todayEnd)
      ) {
        // (todo) - only get the availabilities if the end time of availability is being greater than now
        // if (isAfter(addMinutes(current, 30), new Date(Date.now())))
        // (todo) - check for overlapping bookings directly in MongoDB

        const isAvailable = bookings.find((bkng) => {
          if (
            bkng.startTime.getMinutes() == current.getMinutes() &&
            bkng.startTime.getHours() === current.getHours() &&
            bkng.startTime.getDate() === current.getDate()
          ) {
            return bkng;
          }
        });

        if (isAvailable || isBefore(current, new Date())) {
          current = addMinutes(current, 30);
          continue;
        }

        AvailableSlots[key].push({
          startTime: current,
          endTime: addMinutes(current, 30),
          consultantId: `${loggedInUser._id}`,
          availabilityId: `${availability._id}`,
        });

        current = addMinutes(current, 30);
      }
    }

    return res.json({
      success: true,
      message: "Availabilities Fetched Successfully",
      data: { timeSlots: AvailableSlots },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAvailability = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const loggedInUser = req.user!;
    const availability = await Availability.findById(id);

    if (!availability) throw new CustomError("Availability Not Found", 404);

    const loggedInUserId = new Types.ObjectId(loggedInUser._id as string);

    if (!availability?.consultantId.equals(loggedInUserId))
      // (todo) - look for equals method to verify if they are equal or not
      throw new CustomError(
        "You are Not Authorized to delete Availability",
        403
      );

    if (availability.status === "Booked")
      throw new CustomError("Booked Availability can't be deleted", 400);

    await availability.deleteOne();
    res.status(200).json({
      success: true,
      message: "Availability Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
};
