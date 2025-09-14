import { NextFunction, Request, Response } from "express";
import Booking from "../models/booking.model";
import { CustomError } from "../middlewares/error";
import Availability from "../models/availability.model";
import User from "../models/user.model";
import { Schema, startSession } from "mongoose";
import { creditTransaction } from "../utils/creditTransaction";

export const getMyBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role, _id } = req.user!;
    if (role != "consultant" && role != "student")
      throw new CustomError(
        "No Bookings Yet. Please Complete Onboarding.",
        401
      );

    if (role == "student")
      return res.status(200).json({
        success: true,
        message: "Booking Fetched Successfully",
        data: {
          bookings: await Booking.find({ status: "scheduled", studentId: _id }),
        },
      });

    //   Consultant
    return res.status(200).json({
      success: true,
      message: "Booking Fetched Successfully",
      data: {
        bookings: await Booking.find({
          status: "scheduled",
          consultantId: _id,
        }),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const session = await startSession();
  try {
    session.startTransaction();
    const { availabilityId } = req.params;
    const { consultantId } = req.body;
    const availability = await Availability.findById(availabilityId);
    const loggedInUser = req.user!;

    const consultant = await User.findById(consultantId);
    if (!consultant) throw new CustomError("Cunsultant Not Found", 404);

    // check if the student have enough credits for booking an appointment
    if (loggedInUser.credits < 2)
      throw new CustomError("Insufficient credits", 400);

    // if availability does not exists or already booked or already expired
    if (!availability) throw new CustomError("Availability Not Found", 404);
    if (availability.isBooked)
      throw new CustomError("Availability is Already Booked", 400);
    if (availability.startTime < new Date(Date.now()))
      throw new CustomError("Availability is Expired", 400);

    availability.isBooked = true;
    await availability.save();

    // transfer credits from student to consultant
    await creditTransaction({
      studentId: loggedInUser._id as Schema.Types.ObjectId,
      consultantId,
      session,
    });

    const booking = await Booking.create({
      availabilityId,
      consultantId,
      studentId: loggedInUser._id,
      status: "scheduled",
    });
    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Availability Booked Successfully",
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req.user!;
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) throw new CustomError("Booking Not Found", 404);
    if (booking.studentId != loggedInUser._id)
      throw new CustomError("You Are Not Authorized to Delete Booking", 401);

    const availability = await Availability.findById(booking.availabilityId);
    if (!availability) throw new CustomError("Availability Not Found", 404);
    if (!availability.isBooked)
      throw new CustomError("Only Booked Availability can be Deleted", 400);

    // Free Availability When Booking is Deleted
    availability.isBooked = false;
    await availability.save();
    await booking.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Booking Deleted Successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAllBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Populate - Will get Data from User Schema
    const bookings = await Booking.find({})
      .populate("studentId", "username email")
      .populate("consultantId", "username email");
    res.status(200).json({
      success: true,
      message: "Bookings Fetched Successfully",
      data: { bookings },
    });
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Populate - Will get Data from User Schema
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId)
      .populate("studentId", "username email role")
      .populate("consultantId", "username email role consultantProfile")
      .populate("availabilityId", "consultantId startTime endTime isBooked");
    res.status(200).json({
      success: true,
      message: "Bookings Fetched Successfully",
      data: { booking },
    });
  } catch (error) {
    next(error);
  }
};
