import { ClientSession, Schema, startSession } from "mongoose";
import User from "../models/user.model";

export const creditTransaction = async ({
  studentId,
  consultantId,
  session,
}: {
  studentId: Schema.Types.ObjectId;
  consultantId: Schema.Types.ObjectId;
  session: ClientSession;
}) => {
  await User.findByIdAndUpdate(
    studentId,
    { $inc: { credits: -2 } },
    { session }
  );

  await User.findByIdAndUpdate(
    consultantId,
    { $inc: { credits: 2 } },
    { session }
  );
};
