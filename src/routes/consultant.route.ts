import { Router } from "express";
import {
  consultantOnboarding,
  getConsultants,
} from "../controllers/consultant.controller";
import { isAuthenticated } from "../middlewares/auth";
const consultantRouter = Router();

consultantRouter.get("/", getConsultants);
consultantRouter.patch("/onboarding", isAuthenticated, consultantOnboarding);

export default consultantRouter;
