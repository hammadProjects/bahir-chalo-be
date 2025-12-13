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
import { limiter } from "../utils/rateLimiters";

const authRouter = Router();

authRouter.post(
  "/sign-up",
  limiter("Too many attempts to create an account. Please Try again later."),
  validateRequest(signUpSchema),
  signUp
);

authRouter.post(
  "/sign-in",
  limiter("Too many attempts to login. Please try again later."),
  // validateRequest(signInSchema),
  signIn
);

authRouter.post("/sign-out", signOut);

// verify otp
authRouter.post("/otp/verify", validateRequest(verifyOTPSchema), verifyOtp);
authRouter.post(
  "/otp/resend",
  limiter("Too many OTP verification attempts. Please try again later."),
  // validateRequest(resendOTPSchema),
  resendVerifyOtp
);

// reset password
authRouter.post(
  "/password/forgot",
  limiter("Too many forgot password attempts. Please try again later."),
  // validateRequest(forgetPasswordSchema),
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
