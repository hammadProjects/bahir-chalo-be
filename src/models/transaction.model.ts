import { model, Schema } from "mongoose";
import { TransactionDocument } from "../utils/types";

const schema = new Schema<TransactionDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "UserId is required"],
    },
    type: {
      type: String,
      enum: [
        "CREDIT_PURCHASE",
        "APPOINTMENT_DEDUCTION",
        "APPOINTMENT_EARNING",
        "PAYOUT_REQUEST",
      ],
      required: [true, "Transaction type is required"],
    },
    credits: {
      type: Number,
      min: [1, "At least 1 Credit is required for Transaction"],
      required: [true, "Credits are required"],
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: function () {
        return this.type === "APPOINTMENT_DEDUCTION" ||
          this.type === "APPOINTMENT_EARNING"
          ? "completed"
          : "pending";
      },
    },
    stripeSessionId: {
      type: String,
      required: function () {
        return this.type === "CREDIT_PURCHASE";
      },
    },
    stripePaymentIntentId: {
      type: String,
    },
    planType: {
      type: String,
      enum: ["basic", "standard", "premium"],
      required: function () {
        return this.type === "CREDIT_PURCHASE";
      },
    },
  },
  { timestamps: true },
);
const Transaction = model("transaction", schema);
export default Transaction;
