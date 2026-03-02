import { PLANS } from "../utils/utils";
import { PlanType } from "../utils/types";
import { CustomError } from "../middlewares/error";
import { createStripeConfig } from "../config/stripe.config";
import User from "../models/user.model";
import Transaction from "../models/transaction.model";
import { UserDocument } from "../utils/types";
import Stripe from "stripe";

export const buyCredits = async (user: UserDocument, planType: PlanType) => {
  const selectedPlan = PLANS[planType];
  if (!selectedPlan) throw new CustomError("Selected plan is not valid", 400);
  const stripe = createStripeConfig();

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price: selectedPlan.priceId as string,
        quantity: 1,
      },
    ],
    metadata: {
      userId: String(user._id),
      planType: planType,
      credits: String(selectedPlan.credits),
    },
    success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
  });
  // CHECKOUT_SESSION_ID is automatically filled by stripe

  const transaction = await Transaction.create({
    userId: user._id,
    type: "CREDIT_PURCHASE",
    credits: selectedPlan.credits,
    planType: planType,
    stripeSessionId: session.id,
    status: "pending",
  });

  return {
    sessionUrl: session.url,
    sessionId: session.id,
    transactionId: transaction._id,
  };
};

export const processCreditPurchaseWebhook = async (event: Stripe.Event) => {
  const stripe = createStripeConfig();
  const session = event.data.object as Stripe.Checkout.Session;

  // Verify session has required metadata
  if (!session.metadata?.userId || !session.metadata?.planType)
    throw new CustomError("Invalid session metadata", 400);

  const userId = session.metadata.userId;
  const planType = session.metadata.planType as PlanType;
  const sessionId = session.id;

  /*
    Get payment intent to verify payment status
    intent is verifying stripe that the user i am going to send credits pay successfuly or not
  */
  let paymentIntentId = "";
  if (session.payment_intent) {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      session.payment_intent as string,
    );
    if (paymentIntent.status !== "succeeded")
      throw new CustomError("Payment did not succeed", 400);
    paymentIntentId = paymentIntent.id;
  }

  const mongoSession = await User.startSession();
  mongoSession.startTransaction();

  try {
    const selectedPlan = PLANS[planType];
    if (!selectedPlan) throw new CustomError("Invalid plan type", 400);

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $inc: { credits: selectedPlan.credits },
      },
      { new: true, session: mongoSession },
    );

    if (!user) throw new CustomError("User not found", 404);

    const transaction = await Transaction.findOneAndUpdate(
      { stripeSessionId: sessionId },
      {
        status: "completed",
        stripePaymentIntentId: paymentIntentId,
      },
      { new: true, session: mongoSession },
    );

    if (!transaction)
      throw new CustomError("Transaction record not found", 404);

    await mongoSession.commitTransaction();

    return {
      success: true,
      userId,
      creditsAdded: selectedPlan.credits,
      message: "Credits successfully added to account",
    };
  } catch (error) {
    await mongoSession.abortTransaction();
    throw error;
  } finally {
    await mongoSession.endSession();
  }
};

export const verifyPaymentStatus = async (sessionId: string) => {
  try {
    const stripe = createStripeConfig();
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      // Find the transaction to get user info
      const transaction = await Transaction.findOne({
        stripeSessionId: sessionId,
      });

      if (transaction) {
        return {
          status: "completed",
          paid: true,
          transactionId: transaction._id,
          credits: transaction.credits,
          planType: transaction.planType,
        };
      }
    }

    return {
      status: session.payment_status,
      paid: session.payment_status === "paid",
    };
  } catch (error) {
    throw new CustomError(
      error instanceof Error ? error.message : "Failed to verify payment",
      400,
    );
  }
};

export const payoutCredits = async (
  user: UserDocument,
  creditsToCheckout: number,
) => {
  if (!creditsToCheckout || creditsToCheckout <= 0)
    throw new CustomError("At least 1 credit is required for transaction", 400);

  if (user.credits < creditsToCheckout)
    throw new CustomError("Insufficient credits", 400);

  // user.credits -= creditsToCheckout;
  // await user.save();

  const transaction = await Transaction.create({
    userId: user._id,
    type: "PAYOUT_REQUEST",
    credits: creditsToCheckout,
    status: "pending",
  });

  return transaction;
};
