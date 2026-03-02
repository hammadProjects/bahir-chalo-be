import { NextFunction, Request, Response } from "express";
import { CustomError } from "../middlewares/error";
import { PlanType } from "../utils/types";
import { createStripeConfig } from "../config/stripe.config";
import * as paymentService from "../services/payment.service";
import Stripe from "stripe";

export const buyCredits = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const loggedInUser = req.user!;
    const { planType } = req.body;

    const result = await paymentService.buyCredits(
      loggedInUser,
      planType as PlanType,
    );

    res.status(200).json({
      success: true,
      message: "Checkout session created",
      sessionUrl: result.sessionUrl, // if the checkout fails or passes the a url is sent
      sessionId: result.sessionId,
      transactionId: result.transactionId,
    });
  } catch (error) {
    next(error);
  }
};

export const stripeWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stripe = createStripeConfig();
    const signature = req.headers["stripe-signature"]; // verifies if the request is coming from stripe or not
    console.log(signature);

    if (!signature) throw new CustomError("No Stripe signature found", 400);

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      throw new CustomError("Webhook secret not configured", 500);
    }

    // verifying stripe signature - using inner try catch to find out if the event is successful or not
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      throw new CustomError(
        `Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`,
        400,
      );
    }

    // Process webhook
    if (event.type === "checkout.session.completed")
      await paymentService.processCreditPurchaseWebhook(event);

    // Send acknowledgment to stripe that we have got this request
    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};

export const checkPaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { sessionId } = req.query;

    if (!sessionId || typeof sessionId !== "string")
      throw new CustomError("Session ID is required", 400);

    const result = await paymentService.verifyPaymentStatus(sessionId);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const payoutCredits = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const loggedInUser = req.user!;
    const { creditsToCheckout } = req.body;

    const result = await paymentService.payoutCredits(
      loggedInUser,
      creditsToCheckout,
    );

    res.status(200).json({
      success: true,
      message: "Payout request submitted and will be verified by admin",
      transaction: result,
    });
  } catch (error) {
    next(error);
  }
};
