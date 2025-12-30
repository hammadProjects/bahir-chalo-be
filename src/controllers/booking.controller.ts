import { NextFunction, Request, Response } from "express";
import Booking from "../models/booking.model";
import { CustomError } from "../middlewares/error";
import Availability from "../models/availability.model";
import User from "../models/user.model";
import { Schema, startSession } from "mongoose";
import { creditTransaction } from "../utils/creditTransaction";
import { isBefore } from "date-fns";
import {
  addParticipantsInMeeting,
  createRealtimeMeeting,
} from "../utils/realtimeCloudflareAPI";
import {
  createBookingBody,
  createBookingBodySchema,
  createBookingParams,
  createBookingParamsSchema,
  getMyBookingsQuerySchema,
} from "../schemas/booking.schema";
import * as bookingService from "../services/booking.service";

export const getMyBookings = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = getMyBookingsQuerySchema.safeParse(req.query);
    if (!result.success)
      throw new CustomError(String(result.error?.message), 400);

    const { bookings, totalBookings, page, limit } =
      await bookingService.getMyBookings(req.user!, result.data);

    return res.status(200).json({
      success: true,
      message: "Booking Fetched Successfully",
      pagination: {
        bookings,
        totalBookings,
        totalPages: Math.ceil(totalBookings / limit),
        hasPrev: page > 1,
        hasNext: page < Math.ceil(totalBookings / limit),
        currentPage: page,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (
  req: Request<createBookingParams, {}, createBookingBody>,
  res: Response,
  next: NextFunction
) => {
  const session = await startSession();
  try {
    session.startTransaction();
    const avlResult = createBookingParamsSchema.safeParse(req.params);
    const result = createBookingBodySchema.safeParse(req.body);

    if (!result.success)
      throw new CustomError(String(result.error.message), 400);

    if (!avlResult.success)
      throw new CustomError(String(avlResult?.error.message), 400);

    const { id: availabilityId } = avlResult.data;
    const { startTime, endTime, notes } = result.data;

    const availability = await Availability.findById(availabilityId);
    const loggedInUser = req.user!;

    if (loggedInUser.role !== "student")
      throw new CustomError("Only Student can book appointments", 401);

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

    let MeetingResponse;

    try {
      MeetingResponse = await createRealtimeMeeting(
        `${loggedInUser?.username} - ${consultant?.username}`
      );
      console.log(MeetingResponse.data);
    } catch (error) {
      await session.abortTransaction();
      console.log(error);
      throw new CustomError("Meeting creation failed", 500);
    }

    const newBooking = await Booking.create(
      {
        availabilityId,
        consultantId,
        studentId: loggedInUser._id,
        startTime,
        endTime,
        status: "scheduled",
        notes,
        meetingId: MeetingResponse?.data?.data?.id,
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

    // loggedInUser?.credits = loggedInUser?.credits + 2;
    // await loggedInUser.save();

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

export const joinAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req.user;
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new CustomError("Booking does not exists", 404);

    if (!["consultant", "student"].includes(`${loggedInUser?.role}`))
      throw new CustomError("you are not allowed to join the meeting", 401);

    if (
      ![`${booking.consultantId}`, `${booking.studentId}`].includes(
        `${loggedInUser?._id}`
      )
    )
      throw new CustomError("you are not allowed to join the call", 401);

    const now = new Date(Date.now());
    const beforeFiveMinutes = new Date(
      new Date(booking?.startTime).getTime() - 5 * 60 * 1000
    );

    // meeting has already ended
    // if (isAfter(now, booking?.endTime))
    //   throw new CustomError("The meeting has already ended", 400);

    // can only join five minutes before meeting starts
    // if (isBefore(now, beforeFiveMinutes))
    //   throw new CustomError(
    //     "You can only join the meeting 5 minutes before the start time.",
    //     400
    //   );

    const preset_name =
      loggedInUser?.role === "student"
        ? "participant"
        : loggedInUser?.role === "consultant"
        ? "host"
        : "";

    const AddParticipantResponse = await addParticipantsInMeeting(
      booking?.meetingId,
      preset_name,
      `${loggedInUser?._id}`,
      `${loggedInUser?.username}`
    );

    return res.json({
      success: true,
      data: {
        token: AddParticipantResponse.data?.data?.token,
        meetingId: booking?.meetingId,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const completeBooking = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new CustomError("Booking does not exists", 404);

    if (isBefore(booking.endTime, new Date()))
      throw new CustomError(
        "You can only complete appointment after it has been completed",
        400
      );

    booking.status = "completed";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking has been completed successfully",
    });
  } catch (error) {
    next(error);
  }
};
