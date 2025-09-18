import { model, Schema } from "mongoose";

const schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "UserId is required"],
    },
    type: {
      type: String,
      enum: ["CREDIT_PURCHASE", "APPOINTMENT_DEDUCTION", "APPOINTMENT_EARNING"],
      required: [true, "Transaction type is required"],
    },
    credits: {
      type: Number,
      min: [1, "Atleast 1 Credit is required for Transaction"],
      required: [true, "Credits are required"],
    },
  },
  { timestamps: true }
);
const Transaction = model("transaction", schema);
export default Transaction;
