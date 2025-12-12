import { Router } from "express";
import {
  consultantOnboarding,
  // createDailyAvailabilities,
  getConsultantById,
  getVerifiedConsultants,
  searchConsultants,
  validateStatus,
} from "../controllers/consultant.controller";
import { isAuthenticated } from "../middlewares/auth";
const consultantRouter = Router();

// Verified Only Consultants for Students
consultantRouter.get("/", getVerifiedConsultants);
consultantRouter.get("/search", searchConsultants);

consultantRouter.get("/status/validate", isAuthenticated, validateStatus);

consultantRouter.get("/:id", isAuthenticated, getConsultantById);
consultantRouter.patch("/onboarding", isAuthenticated, consultantOnboarding);

export default consultantRouter;
