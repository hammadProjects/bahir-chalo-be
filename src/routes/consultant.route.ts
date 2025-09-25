import { Router } from "express";
import {
  consultantOnboarding,
  getConsultantById,
  getVerifiedConsultants,
} from "../controllers/consultant.controller";
import { isAuthenticated } from "../middlewares/auth";
const consultantRouter = Router();

// For Students
consultantRouter.get("/", isAuthenticated, getVerifiedConsultants);
consultantRouter.get("/:id", isAuthenticated, getConsultantById);
consultantRouter.patch("/onboarding", isAuthenticated, consultantOnboarding);

export default consultantRouter;
