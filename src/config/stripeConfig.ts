import Stripe from "stripe";
import { CustomError } from "../middlewares/error";

if (!process.env?.STRIPE_SECRET) {
  throw new CustomError("STRIPE SECRET KEY is missing", 400);
}

const stripe = new Stripe(process.env?.STRIPE_SECRET);
export default stripe;
