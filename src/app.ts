import express from "express";

import authRouter from "./routes/auth.route";
import consultantRouter from "./routes/consultant.route";
import adminRouter from "./routes/admin.route";

import dotenv from "dotenv";
import { error } from "./middlewares/error";
dotenv.config();

const app = express();

// middlewares
app.use(express.json()); // pasrese data coming from body

// routes
app.use("/auth", authRouter);
app.use("/consultant", consultantRouter);
app.use("/admin", adminRouter);

// error
app.use(error);

export default app;
