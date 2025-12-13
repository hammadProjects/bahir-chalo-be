import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth";
import {
  generateRoadmap,
  getAllRoadmaps,
  getRoadmapById,
} from "../controllers/student.controller";

const studentRouter = Router();

// GEMINI
studentRouter.post(
  "/roadmap/generate/:country",
  isAuthenticated,
  generateRoadmap
);
// get all previous roadmaps
studentRouter.get("/roadmap", isAuthenticated, getAllRoadmaps);
studentRouter.get("/roadmap/:roadmapId", isAuthenticated, getRoadmapById);

export default studentRouter;
