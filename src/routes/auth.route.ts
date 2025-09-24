import { Router } from "express";
import {
  forgetPassword,
  resendVerifyOtp,
  resetPassword,
  signIn,
  signOut,
  signUp,
  validateToken,
  verifyOtp,
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middlewares/auth";

const authRouter = Router();

authRouter.put("/validate-token", isAuthenticated, validateToken);
authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/otp/verify", verifyOtp);
authRouter.post("/otp/resend", resendVerifyOtp);
authRouter.post("/forget-password", forgetPassword); // initiate forget password
authRouter.post(
  "/reset-password/:token",
  resetPassword
); /* gets the new password along with uuid to verify */
authRouter.post("/sign-out", signOut);

export default authRouter;
