import { CustomError } from "../middlewares/error";
import Booking from "../models/booking.model";
import { getMyBookingsQuery } from "../schemas/booking.schema";
import { UserDocument } from "../utils/types";
import { SAFE_USER_SELECT } from "../utils/utils";

export const getMyBookings = async (
  user: UserDocument,
  { page, limit }: getMyBookingsQuery
) => {
  const skip = (page - 1) * limit;

  if (user?.role !== "consultant" && user?.role !== "student")
    throw new CustomError("You are not authenticated to View Bookings", 401);

  const filter =
    user?.role === "student"
      ? { studentId: user?._id }
      : { consultantId: user?._id };

  const bookings = await Booking.find(filter)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 })
    .populate([
      { path: "studentId", select: SAFE_USER_SELECT },
      { path: "consultantId", select: SAFE_USER_SELECT },
      { path: "availabilityId", select: "startTime endTime" },
    ]);

  const totalBookings = await Booking.countDocuments(filter);
  return { bookings, totalBookings, page, limit };
};
