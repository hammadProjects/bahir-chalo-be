import { NextFunction, Request, Response } from "express";
import * as authSchema from "../schemas/auth.schema";
import * as authService from "../services/auth.service";
import { CustomError } from "../middlewares/error";

export const signUp = async (
  req: Request<{}, {}, authSchema.signUpBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await authService.signUp(req.body, req.profilePicture!);

    return res
      .cookie("email", req.body.email, {
        sameSite: "none",
        secure: true,
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .status(201)
      .json({
        success: true,
        message: `OPT code has been sent to ${req.body?.email}`,
      });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (
  req: Request<{}, {}, authSchema.signInBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.signIn({ email, password });
    res
      .cookie("token", token, {
        sameSite: "none",
        secure: true,
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }) // 7 days
      .json({
        success: true,
        message: `Welcome Back ${user?.username}`,
        token,
        user,
      });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (
  req: Request<{}, {}, authSchema.verifyOTPBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = authSchema.verifyOTPBodySchema.safeParse(req.body);
    if (!result.success)
      throw new CustomError(String(result.error?.message), 400);

    const { otpCode, email } = result.data;
    const { token, user } = await authService.verifyOtp({ otpCode, email });

    res
      .cookie("token", token, {
        sameSite: true,
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .json({
        success: true,
        message: "Welcome! You are successfully Logged In",
        role: user?.role,
        token,
      });
  } catch (error) {
    next(error);
  }
};

export const resendVerifyOtp = async (
  req: Request<{}, {}, authSchema.resendVerifyOTPBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = authSchema.resendOTPBodySchema.safeParse(req.body);
    if (!result.success)
      throw new CustomError(String(result.error?.message), 400);

    const { email } = result.data;
    const { user } = await authService.resendVerifyOtp({ email });

    return res.status(201).json({
      success: true,
      message: `OPT code has been sent to ${user?.email}`,
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request<{}, {}, authSchema.forgetPasswordBody>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = authSchema.forgetPasswordBodySchema.safeParse(req.body);
    if (!result.success)
      throw new CustomError(String(result.error?.message), 400);

    const { email } = result.data;
    await authService.forgotPassword({ email });

    res.status(200).json({
      success: true,
      message: `Reset Link has been Sent to your ${email}`,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request<
    authSchema.resetPasswordParams,
    {},
    authSchema.resetPasswordBody
  >,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = authSchema.signInBodySchema.safeParse(req.body); // same schema as sign in
    if (!result.success)
      throw new CustomError(String(result.error?.message), 400);

    const paramsResult = authSchema.resetPasswordParamsSchema.safeParse(
      req.params,
    );

    if (!paramsResult.success)
      throw new CustomError(String(paramsResult.error?.message), 400);

    const { email, password } = result.data;
    const { token } = paramsResult.data; // uuid from reset sent link
    await authService.resetPassword({ email, password, token });

    res.status(200).json({
      success: true,
      message: "Password has been changed Successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const validateToken = async (req: Request, res: Response) => {
  const loggedInUser = req.user;
  return res.status(200).json({
    success: true,
    message: "Token is Validated Successfully",
    role: loggedInUser?.role,
    user: loggedInUser,
  });
};

export const signOut = (req: Request, res: Response) => {
  res
    .clearCookie("token")
    .status(200)
    .json({ success: true, message: "You are Successfully Logged Out" });
};
