import { CustomError } from "../middlewares/error";
import Booking from "../models/booking.model";
import { getMyBookingsQuery } from "../schemas/booking.schema";
import { UserDocument } from "../utils/types";
import { SAFE_USER_SELECT } from "../utils/utils";

export const getMyBookings = async (
  user: UserDocument,
  { page, limit }: getMyBookingsQuery,
) => {
  const skip = (page - 1) * limit;

  if (user?.role !== "consultant" && user?.role !== "student")
    throw new CustomError("You are not authenticated to View Bookings", 401);

  const filter =
    user?.role === "student"
      ? { studentId: user?._id }
      : { consultantId: user?._id };

  const bookings = await Booking.aggregate([
    { $match: filter },
    {
      $addFields: {
        statusPriority: {
          $switch: {
            branches: [
              { case: { $eq: ["$status", "scheduled"] }, then: 1 },
              { case: { $eq: ["$status", "completed"] }, then: 2 },
              { case: { $eq: ["$status", "cancelled"] }, then: 3 },
            ],
          },
        },
      },
    },
    {
      $sort: { statusPriority: 1, startTime: 1 },
    },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "studentId",
        foreignField: "_id",
        as: "student",
        pipeline: [
          {
            $project: {
              password: 0,
              otpCode: 0,
              otpExpiry: 0,
              passwordResetId: 0,
              passwordResetExpiry: 0,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "consultantId",
        foreignField: "_id",
        as: "consultant",
        pipeline: [
          {
            $project: {
              password: 0,
              otpCode: 0,
              otpExpiry: 0,
              passwordResetId: 0,
              passwordResetExpiry: 0,
            },
          },
        ],
      },
    },
    { $unwind: "$student" },
    { $unwind: "$consultant" },
  ]);

  const totalBookings = await Booking.countDocuments(filter);
  return { bookings, totalBookings, page, limit };
};
