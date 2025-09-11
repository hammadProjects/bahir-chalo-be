import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { getOtpCode } from "../utils/utils";
import { validateSignUp } from "../utils/validation";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { CustomError } from "../middlewares/error";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;
    // (todo) - validate using zod
    validateSignUp({ username, email, password });

    // send otp to email (todo)
    const otpCode = getOtpCode();
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({ username, email, password: hashedPassword, otpCode });
    return res.status(201).json({
      success: true,
      message: "User created Successfully!",
      otp: otpCode, // (todo) - remove when sent on email
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });

    if (!findUser) throw new CustomError("User Not Found", 404);

    // returns boolean
    const isMatched = await bcrypt.compare(password, findUser.password);

    // check for valid status code
    if (!isMatched) throw new CustomError("Password is Incorrect", 400);

    const token = findUser.getJwt();
    res
      .cookie("token", token, {
        sameSite: true,
        httpOnly: true,
        expires: new Date(Date.now() + 604800000),
      }) // 7 days
      .json({ success: true, message: "Welcome Back!" });
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { otpCode, email } = req.body;
    const findUser = await User.findOne({ email });

    if (!findUser) throw new CustomError("User Not Found", 404);

    if (findUser.otpExpiry < new Date() || findUser.otpCode != otpCode)
      throw new CustomError("OTP is Invalid. Please Try Again!", 400);

    // verify OTP to true
    findUser.otpVerified = true;
    await findUser.save();

    const token = findUser.getJwt();
    res
      .cookie("token", token, {
        sameSite: true,
        httpOnly: true,
        expires: new Date(Date.now() + 604800000),
      })
      .json({
        success: true,
        message: "Welcome! You are successfully Logged In",
      });
  } catch (error) {
    next(error);
  }
};

export const resendVerifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) throw new CustomError("User Not Found", 404);

    // (todo) - send otp on mail
    const otpCode = getOtpCode();
    findUser.otpCode = otpCode;
    findUser.otpExpiry = new Date(Date.now() + 1000 * 60 * 2);
    await findUser.save();

    res.status(200).json({
      success: true,
      message: `OTP code has been sent to ${email}`,
      otpCode,
    });
  } catch (error) {
    next(error);
  }
};

export const forgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const findUser = await User.findOne({ email });

    if (!findUser) throw new CustomError("User Not Found", 404);

    // send resest link as mail(todo)
    // generate uuid
    findUser.passwordResetId = uuidv4();
    findUser.passwordResetExpiry = new Date(Date.now() + 1000 * 60 * 5);
    await findUser.save();

    res.status(200).json({
      success: true,
      message: `Reset Link is Sent to your ${email}`,
      link: `https://www.my-app/reset-password/${findUser.passwordResetId}`,
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const { token } = req.params; // uuid from reset sent link

    const findUser = await User.findOne({ email });

    if (!findUser) throw new CustomError("User Not Found", 404);

    if (
      findUser.passwordResetExpiry &&
      (findUser.passwordResetExpiry < new Date() ||
        findUser.passwordResetId != token)
    )
      throw new CustomError("Link is expired. Please Try Again!", 400);

    const hashedPassword = await bcrypt.hash(password, 10);
    findUser.password = hashedPassword;
    await findUser.save();

    res.status(200).json({
      success: true,
      message: "Password is changes Successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = (req: Request, res: Response) => {
  // expects a date object
  res.cookie("token", null, { expires: new Date(Date.now()) });
  // res.clearCookie("token");

  res
    .status(200)
    .json({ success: true, message: "You are Successfully Logged Out" });
};
