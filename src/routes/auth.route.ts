import { Router } from "express";
import * as authController from "../controllers/auth.controller";
import * as authSchema from "../schemas/auth.schema";
import { isAuthenticated } from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import { limiter } from "../utils/rateLimiters";

const authRouter = Router();

authRouter.post(
  "/sign-up",
  limiter("Too many attempts to create an account. Please Try again later."),
  authController.signUp
);

authRouter.post(
  "/sign-in",
  limiter("Too many attempts to login. Please try again later."),
  validateRequest({ bodySchema: authSchema.signInBodySchema }),
  authController.signIn
);

authRouter.post("/sign-out", authController.signOut);

// verify otp
authRouter.post(
  "/otp/verify",
  // validateRequest({ bodySchema: authSchema.verifyOTPBodySchema }),
  authController.verifyOtp
);
authRouter.post(
  "/otp/resend",
  limiter("Too many OTP verification attempts. Please try again later."),
  // validateRequest({ bodySchema: authSchema.resendOTPBodySchema }),
  authController.resendVerifyOtp
);

// reset password
authRouter.post(
  "/password/forgot",
  limiter("Too many forgot password attempts. Please try again later."),
  validateRequest({ bodySchema: authSchema.forgetPasswordBodySchema }),
  authController.forgotPassword
);
authRouter.post(
  "/password/reset/:token",
  validateRequest({
    bodySchema: authSchema.resetPasswordParamsSchema,
    paramsSchema: authSchema.resetPasswordParamsSchema,
  }),
  authController.resetPassword
);

// validate token
authRouter.put(
  "/token/validate",
  isAuthenticated,
  authController.validateToken
);

export default authRouter;
