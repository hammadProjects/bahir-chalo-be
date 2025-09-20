import { NextFunction, Request, Response } from "express";
import { CustomError } from "../middlewares/error";
import { PLANS } from "../utils/utils";
import { PlanType } from "../utils/types";
import Transaction from "../models/transaction.model";

export const buyCredits = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req.user!;
    if (loggedInUser.role !== "student")
      throw new CustomError("Only students can Buy Credits", 401);

    const { planType } = req.body;
    if (!PLANS[planType as PlanType])
      throw new CustomError("Plan Type is Invalid", 400);
    // if payment from student is successful then put the credits into student account

    const selectedPlan = PLANS[planType as PlanType];
    loggedInUser.credits += selectedPlan?.credits;
    await loggedInUser.save();

    await Transaction.create({
      userId: loggedInUser._id,
      credits: selectedPlan?.credits,
      type: "CREDIT_PURCHASE",
    });

    res.status(200).json({
      success: true,
      message: "Credits added to your account Successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const payoutCredits = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const loggedInUser = req.user!;
    const { creditsToCheckout } = req.body;

    if (!creditsToCheckout)
      throw new CustomError("Amount of Credits to Checkout is required", 400);

    if (creditsToCheckout <= 0)
      throw new CustomError(
        "At least 1 credit is required for transaction",
        400
      );

    if (loggedInUser?.credits < creditsToCheckout)
      throw new CustomError("Insufficient credits", 400);

    await Transaction.create({
      credits: creditsToCheckout,
      type: "PAYOUT_REQUEST",
      userId: loggedInUser._id,
    });

    res.status(200).json({
      success: true,
      message: "Your Payout Request will be Verified by Admin shortly",
    });
  } catch (error) {
    next(error);
  }
};
