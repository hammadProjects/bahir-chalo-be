import { Router } from "express";
import {
  forgotPassword,
  resendVerifyOtp,
  resetPassword,
  signIn,
  signOut,
  signUp,
  validateToken,
  verifyOtp,
} from "../controllers/auth.controller";
import { isAuthenticated } from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import {
  signInSchema,
  signUpSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  verifyOTPSchema,
  resendOTPSchema,
} from "../schemas/auth.schema";

const authRouter = Router();

authRouter.post("/sign-up", validateRequest(signUpSchema), signUp);
authRouter.post("/sign-in", validateRequest(signInSchema), signIn);
authRouter.post("/sign-out", signOut);

// verify otp
authRouter.post("/otp/verify", validateRequest(verifyOTPSchema), verifyOtp);
authRouter.post(
  "/otp/resend",
  validateRequest(resendOTPSchema),
  resendVerifyOtp
);

// reset password
authRouter.post(
  "/password/forgot",
  validateRequest(forgetPasswordSchema),
  forgotPassword
);
authRouter.post(
  "/password/reset/:token",
  validateRequest(resetPasswordSchema),
  resetPassword
);

// validate token
authRouter.put("/token/validate", isAuthenticated, validateToken);

export default authRouter;
