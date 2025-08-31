import { Router } from "express";
import {
  consultantOnboarding,
  getConsultants,
} from "../controllers/consultant.route";
import { isAuthenticated } from "../middlewares/auth";

const consultantRouter = Router();

consultantRouter.get("/", getConsultants);
consultantRouter.post("/onboarding", isAuthenticated, consultantOnboarding);

export default consultantRouter;
