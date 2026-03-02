import { NextFunction, Request, Response } from "express";
import Transaction from "../models/transaction.model";
import User from "../models/user.model";
import { CustomError } from "../middlewares/error";
import { SAFE_USER_SELECT } from "../utils/utils";

export const getTransactions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const loggedInUser = req.user!;
    const transactions = await Transaction.find({
      userId: loggedInUser?._id,
      type: { $in: ["PAYOUT_REQUEST", "APPOINTMENT_EARNING"] },
    }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      message: "Transactions fetched successfully",
      transactions,
      credits: loggedInUser.credits,
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingTransactions = async (
  req: Request<{}, {}, { status: string; type: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { status, type } = req.query;
    const transactions = await Transaction.aggregate([
      { $match: { type, status } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user" } },
      {
        $project: {
          type: 1,
          credits: 1,
          status: 1,
          stripeSessionId: 1,
          stripePaymentIntentId: 1,
          planType: 1,
          createdAt: 1,
          updatedAt: 1,
          user: {
            id: { $toString: "$user._id" },
            username: "$user.username",
            email: "$user.email",
            credits: "$user.credits",
          },
        },
      },
    ]);

    return res.json({
      success: true,
      message: "Pending payout transactions fetched successfully",
      data: { transactions },
    });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { transactionId } = req.params;
    const { status } = req.body;

    if (status != "completed")
      throw new CustomError("Invalid action. Use 'approve' only", 400);

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) throw new CustomError("Transaction not found", 404);

    if (transaction.type !== "PAYOUT_REQUEST")
      throw new CustomError("Only payout requests can be managed here", 400);

    if (transaction.status !== "pending")
      throw new CustomError("Transaction is not pending", 400);

    const user = await User.findById(transaction.userId).select(
      SAFE_USER_SELECT,
    );

    if (!user) throw new CustomError("Associated user not found", 404);

    if (status === "approve") {
      if ((user.credits ?? 0) < transaction.credits)
        throw new CustomError("User has insufficient credits", 400);

      user.credits = (user.credits ?? 0) - transaction.credits;
      await user.save();

      transaction.status = "completed";
      await transaction.save();

      return res.json({
        success: true,
        message: "Payout approved",
        data: { transaction, user, credits: user.credits },
      });
    }

    // action === 'reject'
    transaction.status = "failed";
    await transaction.save();

    return res.json({
      success: true,
      message: "Payout rejected",
      // transaction: sanitized,
      credits: user.credits,
    });
  } catch (error) {
    next(error);
  }
};
