import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth";
import {
  generateRoadmap,
  getAllRoadmaps,
  getRoadmapById,
} from "../controllers/student.controller";
import { limiter } from "../utils/rateLimiters";

const studentRouter = Router();

// GEMINI
studentRouter.post(
  "/roadmaps/generate/:country",
  isAuthenticated,
  limiter(
    "Roadmap generation limit reached for today.",
    24 * 60 * 60 * 1000,
    1
  ),
  generateRoadmap
);
// get all previous roadmaps
studentRouter.get("/roadmaps", isAuthenticated, getAllRoadmaps);
studentRouter.get("/roadmaps/:roadmapId", isAuthenticated, getRoadmapById);

export default studentRouter;
