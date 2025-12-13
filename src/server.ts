import { Request, Response } from "express";
import app from "./app";
import { connectDB } from "./config/database";

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("helo world from bahir chalo be");
});
