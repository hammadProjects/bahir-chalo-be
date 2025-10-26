import { model } from "mongoose";
import { Schema } from "mongoose";

const schema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Student ID is required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      minLength: [6, "Title must be 6 characters long"],
      trim: true,
    },
    roadmapData: {
      type: Object,
      required: [true, "Roadmap data is required"],
    },
  },
  { timestamps: true }
);
const Roadmap = model("roadmap", schema);
export default Roadmap;
