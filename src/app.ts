import express from "express";
// validateEnv();

import authRouter from "./routes/auth.route";
import studentRouter from "./routes/student.route";
import adminRouter from "./routes/admin.route";
import bookingRouter from "./routes/booking.route";

import { error } from "./middlewares/error";
import uploadRouter from "./routes/upload.route";
import availabilityRouter from "./routes/availability.route";
import paymentRouter from "./routes/payment.route";
import onboardingRouter from "./routes/onboarding.route";
import app from "./server";

// middlewares

// routes
app.use("/onboarding", onboardingRouter);

app.use("/students", studentRouter);
app.use("/admin", adminRouter);
app.use("/upload", uploadRouter);
app.use("/availabilities", availabilityRouter);
app.use("/booking", bookingRouter);
app.use("/payment", paymentRouter);

// error
app.use(error);
