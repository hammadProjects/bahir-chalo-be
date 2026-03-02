import { Application } from "express";
import adminRouter from "../routes/admin.route";
import authRouter from "../routes/auth.route";
import availabilityRouter from "../routes/availability.route";
import bookingRouter from "../routes/booking.route";
import consultantRouter from "../routes/consultant.route";
import onboardingRouter from "../routes/onboarding.route";
import paymentRouter from "../routes/payment.route";
import studentRouter from "../routes/student.route";
import uploadRouter from "../routes/upload.route";
import profileRouter from "../routes/profile.route";
import transactionRouter from "../routes/transaction.route";

export const bootstrap = (app: Application) => {
  app.use("/auth", authRouter);
  app.use("/me", profileRouter);
  app.use("/consultants", consultantRouter);
  app.use("/onboarding", onboardingRouter);

  app.use("/students", studentRouter);
  app.use("/admin", adminRouter);
  app.use("/upload", uploadRouter);
  app.use("/availabilities", availabilityRouter);
  app.use("/bookings", bookingRouter);
  app.use("/payment", paymentRouter);
  app.use("/transactions", transactionRouter);
};
