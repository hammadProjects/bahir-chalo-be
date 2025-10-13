import { Router } from "express";
import {
  consultantOnboarding,
  // createDailyAvailabilities,
  getConsultantById,
  getVerifiedConsultants,
} from "../controllers/consultant.controller";
import { isAuthenticated } from "../middlewares/auth";
const consultantRouter = Router();

// Verified Only Consultants for Students
consultantRouter.get("/", isAuthenticated, getVerifiedConsultants);

consultantRouter.get("/:id", isAuthenticated, getConsultantById);
consultantRouter.patch("/onboarding", isAuthenticated, consultantOnboarding);

// Creating daily appointments for Consultants - Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
// consultantRouter.post(
//   "/availabilities/daily",
//   isAuthenticated,
//   createDailyAvailabilities
// );

export default consultantRouter;
