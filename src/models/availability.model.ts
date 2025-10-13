import { Schema, model } from "mongoose";

const schema = new Schema(
  {
    consultantId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Consultant ID is required"],
    },
    startTime: {
      type: Date,
      required: [true, "Please Select Starting Time to set Availability"],
    },
    endTime: {
      type: Date,
      required: [true, "Please Select Ending Time to set Availability"],
    },
    status: {
      type: String,
      enum: ["Available", "Booked", "Blocked"],
      default: "Available",
    },
  },
  { timestamps: true }
);
// (todo) - learn about indexing
// if added unique to schena then no 2 consultants could have same time as email
// but now only one consultant will not have same start and end time
schema.index(
  { consultantId: 1, startTime: 1, endTime: 1 },
  { unique: [true, "Availability with this time already exists"] }
);

const Availability = model("availability", schema);
export default Availability;
