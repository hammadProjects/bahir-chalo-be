import { Router } from "express";
import * as adminController from "../controllers/admin.controller";
import { isAdmin, isAuthenticated } from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import { verifyConsultantSchema } from "../schemas/admin.schema";

const adminRouter = Router();

adminRouter.get(
  "/consultants/pending",
  isAuthenticated,
  isAdmin,
  adminController.getPendingConsultants
);

adminRouter.patch(
  "/consultant/:id",
  isAuthenticated,
  isAdmin
  // validateRequest(verifyConsultantSchema)
  // adminController.verifyConsultant
);

adminRouter.get(
  "/consultants",
  isAuthenticated,
  isAdmin,
  adminController.getAllConsultants
);

export default adminRouter;
