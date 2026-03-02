import { Router } from "express";
import { isAuthenticated, isConsultant } from "../middlewares/auth";
import * as availabilityController from "../controllers/availability.controller";
import { setAvailabilityBodySchema } from "../schemas/availability.schema";

const availabilityRouter = Router();

availabilityRouter.get(
  "/",
  isAuthenticated,
  isConsultant,
  availabilityController.getAvailability,
);

availabilityRouter.post(
  "/",
  isAuthenticated,
  isConsultant,
  availabilityController.setAvailability,
);

// availabilityRouter.get(
//   "/:id",
//   isAuthenticated,
//   availabilityController.getAvailabilityById
// );

// availabilityRouter.delete(
//   "/:id",
//   isAuthenticated,
//   availabilityController.deleteAvailability
// );

availabilityRouter.get(
  "/:consultantId/slots",
  availabilityController.getAvailabilityTimeSlots,
);

export default availabilityRouter;
