import { Router } from "express";
import * as consultantController from "../controllers/consultant.controller";
import { isAuthenticated } from "../middlewares/auth";
const consultantRouter = Router();

consultantRouter.get("/", consultantController.getVerifiedConsultants);

consultantRouter.get(
  "/status/validate",
  isAuthenticated,
  consultantController.validateStatus
);

consultantRouter.get("/:id", consultantController.getConsultantById);

export default consultantRouter;
