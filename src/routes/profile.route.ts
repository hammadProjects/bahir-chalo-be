import { Router } from "express";
import * as profileController from "../controllers/profile.controller";
import { isAuthenticated } from "../middlewares/auth";

const profileRouter = Router();

profileRouter.get("/", isAuthenticated, profileController.getProfile);

profileRouter.put(
  "/student",
  isAuthenticated,
  profileController.updateStudentProfile
);

profileRouter.put(
  "/consultant",
  isAuthenticated,
  profileController.updateConsultantProfile
);

export default profileRouter;
