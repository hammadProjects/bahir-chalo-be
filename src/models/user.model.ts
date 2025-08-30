import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    username: {
      type: String,
      minLength: [4, "Username must be atleast 4 Characters"],
      trim: true, // remove extra spaces from start & end
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: [true, "Email is required"],
    },
    password: {
      type: String,
      minLength: [4, "Password must be alteast 4 Characters"],
      required: [true, "Password is required"],
    },
    otpCode: {
      // only to verify the otp
      type: String,
      minLength: 4,
      maxLength: 4,
      required: true,
    },
    otpExpiry: {
      type: Date,
      default: () => Date.now() + 1000 * 60 * 2, // 2 mins
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    passwordResetId: {
      // only to verify the forget password
      type: String,
    },
    passwordResetExpiry: {
      type: Date,
    },
    role: {
      type: String,
      enum: ["student", "consultant", "admin", "unassigned"],
      default: "unassigned",
    },
  },
  { timestamps: true }
);

const User = model("user", schema);
export default User;
