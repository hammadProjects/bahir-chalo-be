import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth";
import {
  studentOnboarding,
  consultantOnboarding,
} from "../controllers/onboarding.controller";
import validateRequest from "../middlewares/validateRequest";
import {
  consultantOnboardingSchema,
  studentOnboardingSchema,
} from "../schemas/onboarding.schema";

const onboardingRouter = Router();

onboardingRouter.patch(
  "/student",
  isAuthenticated,
  validateRequest(studentOnboardingSchema),
  studentOnboarding
);
onboardingRouter.patch(
  "/consultant",
  isAuthenticated,
  validateRequest(consultantOnboardingSchema),
  consultantOnboarding
);

export default onboardingRouter;
