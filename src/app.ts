import express from "express";
import dotenv from "dotenv";
dotenv.config(); // always should run before routes

import authRouter from "./routes/auth.route";
import consultantRouter from "./routes/consultant.route";
import studentRouter from "./routes/student.route";
import adminRouter from "./routes/admin.route";
import bookingRouter from "./routes/booking.route";

import { error } from "./middlewares/error";
import uploadRouter from "./routes/upload.route";
import availabilityRouter from "./routes/availability.route";

const app = express();

// middlewares
app.use(express.json()); // pasrese data coming from body

// routes
app.use("/auth", authRouter);
app.use("/consultant", consultantRouter);
app.use("/student", studentRouter);
app.use("/admin", adminRouter);
app.use("/upload", uploadRouter);
app.use("/availability", availabilityRouter);
app.use("/booking", bookingRouter);

// error
app.use(error);

export default app;
