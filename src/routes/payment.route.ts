import { Router } from "express";
import { isAuthenticated, isConsultant } from "../middlewares/auth";
import { buyCredits, payoutCredits } from "../controllers/payment.controller";

const paymentRouter = Router();

paymentRouter.post("/buy", isAuthenticated, buyCredits);
paymentRouter.post("/payout", isAuthenticated, isConsultant, payoutCredits);

export default paymentRouter;
