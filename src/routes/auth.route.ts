import { Router } from "express";
import {
  forgetPassword,
  resendVerifyOtp,
  resetPassword,
  signIn,
  signOut,
  signUp,
  verifyOtp,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/verify-otp/resend", resendVerifyOtp);
authRouter.post("/forget-password", forgetPassword); // initiate forget password
authRouter.post(
  "/reset-password/:token",
  resetPassword
); /* gets the new password along with uuid to verify */
authRouter.post("/sign-out", signOut);

export default authRouter;
