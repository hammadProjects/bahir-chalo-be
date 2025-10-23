import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth";
import {
  generateRoadmap,
  studentOnboarding,
} from "../controllers/student.controller";

const studentRouter = Router();

studentRouter.patch("/onboarding", isAuthenticated, studentOnboarding);

// GEMINI
studentRouter.post(
  "/roadmap/generate/:country",
  isAuthenticated,
  generateRoadmap
);

export default studentRouter;
