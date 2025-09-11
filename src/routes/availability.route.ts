import { Router } from "express";
import { isAuthenticated, isConsultant } from "../middlewares/auth";
import {
  deleteAvailability,
  //   getAllAvailabilities,
  getAvailabilityById,
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

// availabilityRouter.get(
//   "/:consultantId/all",
//   isAuthenticated,
//   getAllAvailabilities
// );

export default availabilityRouter;
