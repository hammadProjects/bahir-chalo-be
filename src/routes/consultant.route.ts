import { Router } from "express";
import * as consultantController from "../controllers/consultant.controller";
import { isAuthenticated } from "../middlewares/auth";
const consultantRouter = Router();

// Verified Only Consultants for Students
consultantRouter.get("/", consultantController.getVerifiedConsultants);

consultantRouter.get(
  "/status/validate",
  isAuthenticated,
  consultantController.validateStatus
);

consultantRouter.get(
  "/:id",
  isAuthenticated,
  consultantController.getConsultantById
);

export default consultantRouter;
