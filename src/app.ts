import express from "express";
import authRouter from "./routes/auth.route";

import dotenv from "dotenv";
dotenv.config();

const app = express();

// middlewares
app.use(express.json()); // pasrese data coming from body

// routes
app.use("/auth", authRouter);

export default app;
