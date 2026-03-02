import { Router } from "express";
import { isAuthenticated, isConsultant } from "../middlewares/auth";
import { validate } from "../middlewares/validateRequest";
import {
  buyCredits,
  payoutCredits,
  checkPaymentStatus,
} from "../controllers/payment.controller";
import {
  buyCreditSchema,
  payoutCreditsSchema,
  verifyPaymentSchema,
} from "../schemas/payment.schema";

const paymentRouter = Router();

paymentRouter.post(
  "/buy",
  isAuthenticated,
  validate({ bodySchema: buyCreditSchema }),
  buyCredits,
);

paymentRouter.get(
  "/verify",
  isAuthenticated,
  validate({ querySchema: verifyPaymentSchema }),
  checkPaymentStatus,
);

paymentRouter.post(
  "/payout",
  isAuthenticated,
  isConsultant,
  validate({ bodySchema: payoutCreditsSchema }),
  payoutCredits,
);

export default paymentRouter;
