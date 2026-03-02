import { Router } from "express";
import { isAuthenticated, isConsultant, isAdmin } from "../middlewares/auth";
import * as controller from "../controllers/transaction.controller";
import { validate } from "../middlewares/validateRequest";
import { pendingTransactionsQuerySchema } from "../schemas/transaction.schema";
const transactionRouter = Router();

transactionRouter.get(
  "/consultant",
  isAuthenticated,
  isConsultant,
  controller.getTransactions,
);

// Admin routes
transactionRouter.get(
  "/",
  isAuthenticated,
  isAdmin,
  validate({ querySchema: pendingTransactionsQuerySchema }),
  controller.getPendingTransactions,
);

// transactionRouter.patch(
//   "/:transactionId",
//   isAuthenticated,
//   isAdmin,
//   controller.adminUpdateTransaction,
// );

export default transactionRouter;
