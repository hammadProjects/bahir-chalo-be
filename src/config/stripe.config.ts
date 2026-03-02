import Stripe from "stripe";
import { CustomError } from "../middlewares/error";

export const createStripeConfig = () => {
  if (!process.env?.STRIPE_SECRET) {
    throw new CustomError("STRIPE SECRET KEY is missing", 400);
  }

  const stripe = new Stripe(process.env?.STRIPE_SECRET);
  return stripe;
};
