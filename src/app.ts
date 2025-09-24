import express from "express";
import cors from "cors";
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
import paymentRouter from "./routes/payment.route";
import User from "./models/user.model";

const app = express();

// middlewares
app.use(express.json()); // parses data coming from body
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // no trailing / as cors matches exact same string
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  })
);

// routes
app.use("/auth", authRouter);
app.use("/consultant", consultantRouter);
app.use("/student", studentRouter);
app.use("/admin", adminRouter);
app.use("/upload", uploadRouter);
app.use("/availability", availabilityRouter);
app.use("/booking", bookingRouter);
app.use("/payment", paymentRouter);

// const hello = (async () => {
//   await User.findOneAndDelete({ email: "hammadsarwar2200@gmail.com" });
// })();

// error
app.use(error);

export default app;
