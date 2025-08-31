import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const DB_URI = process.env.DB_URI;
    if (!DB_URI) throw new Error("DB_URI is not Available.");
    await mongoose.connect(DB_URI);
  } catch (error) {
    console.log(error);
  }
};
