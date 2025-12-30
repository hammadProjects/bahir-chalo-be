import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth";
import * as onboardingController from "../controllers/onboarding.controller";
import validateRequest from "../middlewares/validateRequest";
import * as onboardingSchema from "../schemas/onboarding.schema";

const onboardingRouter = Router();

onboardingRouter.patch(
  "/student",
  isAuthenticated,
  validateRequest({ bodySchema: onboardingSchema.studentOnboardingBodySchema }),
  onboardingController.studentOnboarding
);

onboardingRouter.patch(
  "/consultant",
  isAuthenticated,
  validateRequest({
    bodySchema: onboardingSchema.consultantOnboardingBodySchema,
  }),
  onboardingController.consultantOnboarding
);

export default onboardingRouter;
