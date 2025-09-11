import { Router } from "express";
import {
  getPendingConsultants,
  verifyConsultant,
} from "../controllers/admin.controller";
import { isAdmin, isAuthenticated } from "../middlewares/auth";

const adminRouter = Router();

adminRouter.get(
  "/consultants/pending",
  isAuthenticated,
  isAdmin,
  getPendingConsultants
);

// just little change in the schema
adminRouter.patch(
  "/consultants/:id",
  isAuthenticated,
  isAdmin,
  verifyConsultant
);

export default adminRouter;
