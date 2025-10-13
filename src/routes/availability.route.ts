import { Router } from "express";
import { isAuthenticated, isConsultant } from "../middlewares/auth";
import {
  deleteAvailability,
  getAllAvailabilities,
  getAvailabilityById,
  getAvailabilityTimeSlots,
  setAvailability,
} from "../controllers/availability.controller";

const availabilityRouter = Router();

availabilityRouter.post("/", isAuthenticated, isConsultant, setAvailability);

availabilityRouter.get(
  "/:id/availability",
  isAuthenticated,
  getAvailabilityById
);

availabilityRouter.delete(
  "/availability/:id",
  isAuthenticated,
  deleteAvailability
);

availabilityRouter.get(
  "/",
  isAuthenticated,
  isConsultant,
  getAllAvailabilities
);

availabilityRouter.get(
  "/:consultantId/slots",
  isAuthenticated,
  getAvailabilityTimeSlots
);

export default availabilityRouter;
