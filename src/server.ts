import express, { Request, Response } from "express";

import { connectDB } from "./config/database";
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

app.get("/", (req: Request, res: Response) => {
  res.send("helo world from bahir chalo be");
});

export default app;
