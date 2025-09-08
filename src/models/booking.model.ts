import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student ID is required"],
    },
    consultantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Consultant ID is required"],
    },
    availabilityId: {
      type: Schema.Types.ObjectId,
      ref: "Availability",
      required: [true, "Availability ID is required"],
      unique: [true, "One Booking Per Availability"],
    },
    status: {
      type: String,
      enum: ["completed", "cancelled", "scheduled"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

const Booking = model("booking", schema);
export default Booking;
