import { Router } from "express";
import {
  getAllConsultants,
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
  "/consultant/:id",
  isAuthenticated,
  isAdmin,
  verifyConsultant
);

adminRouter.get("/consultants", isAuthenticated, isAdmin, getAllConsultants);

export default adminRouter;
