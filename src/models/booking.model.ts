import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Student ID is required"],
    },
    consultantId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Consultant ID is required"],
    },
    availabilityId: {
      type: Schema.Types.ObjectId,
      ref: "availability",
      required: [true, "Availability ID is required"],
      // (todo) - index accordingly so that start time and end time must be unique not availability
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "cancelled", "scheduled", "expired"],
      default: "scheduled",
    },
    notes: {
      type: String, // optional
    },
  },
  { timestamps: true }
);

const Booking = model("booking", schema);
export default Booking;
