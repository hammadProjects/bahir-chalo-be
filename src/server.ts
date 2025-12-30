import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./config/database";
import consultantRouter from "./routes/consultant.route";
import authRouter from "./routes/auth.route";
const app = express();

// const PORT = process.env.PORT || 3000;

let isConnected = false;

if (!isConnected) {
  connectDB();
  isConnected = true;
}

// app.listen(PORT, () => {
//   console.log(`App is running at ${PORT}`);
// });

app.use(express.json()); // parses data coming from body
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // no trailing / as cors matches exact same string
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  })
);

app.use("/auth", authRouter);
app.use("/consultants", consultantRouter);

export default app;
