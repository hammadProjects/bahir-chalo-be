import { Router } from "express";
import {
  forgetPassword,
  resetPassword,
  signIn,
  signUp,
  verifyOtp,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/forget-password", forgetPassword); // initiate
authRouter.post("/reset-password/:token", resetPassword);

export default authRouter;
