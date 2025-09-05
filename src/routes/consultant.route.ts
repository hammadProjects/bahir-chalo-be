import { Router } from "express";
import {
  consultantOnboarding,
  getConsultants,
} from "../controllers/consultant.controller";
import { isAuthenticated, isConsultant } from "../middlewares/auth";
import { setAvailability } from "../controllers/availability.controller";

const consultantRouter = Router();

consultantRouter.get("/", getConsultants);
consultantRouter.post("/onboarding", isAuthenticated, consultantOnboarding);
consultantRouter.post(
  "/availability",
  isAuthenticated,
  isConsultant,
  setAvailability
);

export default consultantRouter;
