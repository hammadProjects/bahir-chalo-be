import { Router } from "express";
import { isAuthenticated, isConsultant } from "../middlewares/auth";
import * as availabilityController from "../controllers/availability.controller";
import validateRequest from "../middlewares/validateRequest";
import { setAvailabilityBodySchema } from "../schemas/availability.schema";

const availabilityRouter = Router();

// Get all availabilities
// availabilityRouter.get(
//   "/",
//   isAuthenticated,
//   isConsultant,
//   availabilityController.getAvailability
// );

availabilityRouter.post(
  "/",
  isAuthenticated,
  isConsultant,
  validateRequest({ bodySchema: setAvailabilityBodySchema }),
  availabilityController.setAvailability
);

availabilityRouter.get(
  "/:id",
  isAuthenticated,
  availabilityController.getAvailabilityById
);

availabilityRouter.delete(
  "/:id",
  isAuthenticated,
  availabilityController.deleteAvailability
);

availabilityRouter.get(
  "/:consultantId/slots",
  isAuthenticated,
  availabilityController.getAvailabilityTimeSlots
);

export default availabilityRouter;
