import { Router } from "express";
import {
  consultantOnboarding,
  getConsultants,
} from "../controllers/consultant.controller";
import { isAuthenticated, isConsultant } from "../middlewares/auth";
import {
  deleteAvailability,
  getAvailability,
  setAvailability,
} from "../controllers/availability.controller";

const consultantRouter = Router();

consultantRouter.get("/", getConsultants);
consultantRouter.post("/onboarding", isAuthenticated, consultantOnboarding);
consultantRouter.post(
  "/availability",
  isAuthenticated,
  isConsultant,
  setAvailability
);
consultantRouter.get("/:id/availability", isAuthenticated, getAvailability);
consultantRouter.delete(
  "/availability/:id",
  isAuthenticated,
  deleteAvailability
);

export default consultantRouter;
