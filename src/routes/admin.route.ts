import { Router } from "express";
import { verifyConsultant } from "../controllers/admin.controller";
import { isAdmin, isAuthenticated } from "../middlewares/auth";

const adminRouter = Router();

adminRouter.post(
  "/consultants/:id",
  isAuthenticated,
  isAdmin,
  verifyConsultant
);

export default adminRouter;
