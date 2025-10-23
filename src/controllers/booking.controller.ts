import { NextFunction, Request, Response } from "express";
import Booking from "../models/booking.model";
import { CustomError } from "../middlewares/error";
import Availability from "../models/availability.model";
import User from "../models/user.model";
import { Schema, startSession } from "mongoose";
import { creditTransaction } from "../utils/creditTransaction";
import { SAFE_USER_SELECT } from "../utils/utils";
import { isBefore } from "date-fns";

export const getMyBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role, _id } = req.user!;
    if (role != "consultant" && role != "student")
      throw new CustomError("You are not authenticated to View Bookings", 401);

    if (role == "student") {
      const studentBookings = await Booking.find({
        // status: "scheduled",
        studentId: _id,
      }).populate([
        { path: "studentId", select: SAFE_USER_SELECT },
        { path: "consultantId", select: SAFE_USER_SELECT },
        { path: "availabilityId", select: "startTime endTime" },
      ]);

      return res.status(200).json({
        success: true,
        message: "Booking Fetched Successfully",
        data: {
          bookings: studentBookings,
        },
      });
    }

    // Consultant
    const consultantBookings = await Booking.find({
      status: "scheduled",
      consultantId: _id,
    }).populate([
      { path: "studentId", select: SAFE_USER_SELECT },
      { path: "consultantId", select: SAFE_USER_SELECT },
      { path: "availabilityId", select: "startTime endTime" },
    ]);

    return res.status(200).json({
      success: true,
      message: "Booking Fetched Successfully",
      data: {
        bookings: consultantBookings,
      },
    });
  } catch (error) {
    console.log(error);
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
    let {
      notes,
      startTime,
      endTime,
    }: { notes: string; startTime: Date; endTime: Date } = req.body;
    startTime = new Date(startTime);
    endTime = new Date(endTime);

    const availability = await Availability.findById(availabilityId);
    const loggedInUser = req.user!;

    if (loggedInUser.role !== "student")
      throw new CustomError("Only Student can book appointments", 401);

    if (!startTime || !endTime)
      throw new CustomError("Start time and end time are required", 400);

    if (isBefore(endTime, startTime))
      throw new CustomError("Start time must be before End time", 400);

    // if availability does not exists or already booked or already expired
    if (!availability)
      throw new CustomError("Availability Does NOT Exists", 404);

    const consultantId = availability.consultantId;
    // (todo) - check how this is working no idea
    const booking = await Booking.findOne({
      consultantId,
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gte: startTime },
        },
      ],
    });

    if (booking?.status === "scheduled")
      throw new CustomError("Appointment is Already Booked in this slot", 400);

    // (todo) - see if in between availability
    const startOfAvailability =
      +`${availability?.startTime?.getHours()}${availability?.startTime?.getMinutes()}`;
    const endOfAvailability =
      +`${availability?.endTime?.getHours()}${availability?.endTime?.getMinutes()}`;

    const startOfAppointment =
      +`${startTime?.getHours()}${startTime?.getMinutes()}`;
    const endOfAppointment = +`${endTime?.getHours()}${endTime?.getMinutes()}`;

    // (todo) - make this condition work
    // if (
    //   startOfAppointment >= endOfAvailability ||
    //   startOfAppointment < startOfAvailability ||
    //   endOfAppointment <= startOfAvailability ||
    //   endOfAppointment > endOfAvailability
    // )
    //   throw new CustomError(
    //     "Start and end time must be in range of Availability",
    //     400
    //   );

    if (startTime < new Date(Date.now()))
      throw new CustomError("Availability is Expired", 400);

    const consultant = await User.findById(consultantId);

    if (!consultant) throw new CustomError("Consultant Not Found", 404);

    // check if the student have enough credits for booking an appointment
    if (loggedInUser.credits < 2)
      throw new CustomError("Insufficient credits", 400);

    if (availability.status === "Booked")
      throw new CustomError("Appointment is Already Booked", 400);

    const appointment = await Booking.findOne({
      startTime,
      endTime,
      consultantId,
      studentId: loggedInUser._id,
      availabilityId,
    });

    if (appointment?.status === "scheduled")
      throw new CustomError("Appointment is already booked", 400);

    // transfer credits from student to consultant
    await creditTransaction({
      studentId: loggedInUser._id as Schema.Types.ObjectId,
      consultantId,
      session,
    });

    const newBooking = await Booking.create(
      {
        availabilityId,
        consultantId,
        studentId: loggedInUser._id,
        startTime,
        endTime,
        status: "scheduled",
        notes,
      }
      // { session }
    );
    await session.commitTransaction(); // commit the transaction before sending the response

    // refetch for updated document
    const updatedUser = await User.findById(loggedInUser._id);
    if (!updatedUser) throw new CustomError("Student Not Found", 404);

    res.status(200).json({
      success: true,
      message: "Availability Booked Successfully",
      data: {
        booking: newBooking,
        remainingCredits: updatedUser?.credits,
      },
    });
  } catch (error) {
    console.log(error);
    next(error);
  } finally {
    session.endSession();
  }
};

export const cancelBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req.user!;
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) throw new CustomError("Booking Not Found", 404);
    if (booking.status !== "scheduled")
      throw new CustomError("Booking has already been completed", 400);

    if (
      !booking.studentId.equals(loggedInUser._id as string) &&
      !booking.consultantId.equals(loggedInUser?._id as string)
    )
      throw new CustomError("You are not allowed to delete Booking", 401);

    // Free Availability When Booking is Deleted
    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking Canceled Successfully",
      remainingCredits: loggedInUser.credits,
    });
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
