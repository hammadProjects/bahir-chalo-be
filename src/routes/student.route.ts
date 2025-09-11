import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth";
import { studentOnboarding } from "../controllers/student.controller";

const studentRouter = Router();

studentRouter.patch("/onboarding", isAuthenticated, studentOnboarding);

export default studentRouter;
