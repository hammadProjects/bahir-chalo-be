import { Router } from "express";
import { isAdmin, isAuthenticated } from "../middlewares/auth";
import {
  createBooking,
  cancelBooking,
  getAllBookings,
  getBookingById,
  getMyBookings,
} from "../controllers/booking.controller";

const bookingRouter = Router();

bookingRouter.get("/mine", isAuthenticated, getMyBookings);

// Find Availability then create Booking
bookingRouter.post("/:availabilityId", isAuthenticated, createBooking);

// Booking already created
bookingRouter.delete("/:bookingId", isAuthenticated, cancelBooking);

// get booking by id
bookingRouter.get("/:bookingId", isAuthenticated, isAdmin, getBookingById);

// get all bookings
bookingRouter.get("/admin/all", isAuthenticated, isAdmin, getAllBookings);

export default bookingRouter;
