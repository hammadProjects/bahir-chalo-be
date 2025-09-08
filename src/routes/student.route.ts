import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth";
import { studentOnboarding } from "../controllers/student.controller";

const studentRouter = Router();

studentRouter.post("/onboarding", isAuthenticated, studentOnboarding);

export default studentRouter;
