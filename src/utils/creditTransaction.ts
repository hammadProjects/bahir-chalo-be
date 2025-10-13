import { ClientSession, Schema } from "mongoose";
import mongoose from "mongoose";
import User from "../models/user.model";
import Transaction from "../models/transaction.model";

export const creditTransaction = async ({
  studentId,
  consultantId,
  session,
}: {
  studentId: Schema.Types.ObjectId;
  consultantId: mongoose.Types.ObjectId;
  // consultantId: string;
  session: ClientSession;
}) => {
  await User.findByIdAndUpdate(
    studentId,
    { $inc: { credits: -2 } }
    // { session }
  );

  await Transaction.create(
    {
      userId: studentId,
      credits: 2,
      type: "APPOINTMENT_DEDUCTION",
    }
    // { session }
  );

  await User.findByIdAndUpdate(
    consultantId,
    { $inc: { credits: 2 } }
    // { session }
  );

  await Transaction.create(
    {
      userId: consultantId,
      credits: 2,
      type: "APPOINTMENT_EARNING",
    }
    // { session }
  );
};
