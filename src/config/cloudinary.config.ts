import { v2 as cloudinary } from "cloudinary";
import { CustomError } from "../middlewares/error";

// if (!process.env.CLOUD_NAME)
//   throw new CustomError("CLOUD_NAME is missing", 400);

// if (!process.env.CLOUDINARY_API_KEY)
//   throw new CustomError("CLOUDINARY_API_KEY is missing", 400);

// if (!process.env.CLOUDINARY_API_SECRET)
//   throw new CustomError("CLOUDINARY_API_SECRET is missing", 400);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// expects the original in storage for cloudinary
export { cloudinary };
