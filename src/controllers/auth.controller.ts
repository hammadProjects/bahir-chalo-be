import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import { getOtpCode } from "../utils/utils";
import { validateSignUp } from "../utils/validation";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import { CustomError } from "../middlewares/error";
import { sendEmail } from "../utils/email";

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
    sendEmail(
      email,
      "Bahir Chalo OTP Verification Code",
      `You OTP code is ${otpCode}`
    );

    return res.status(201).json({
      success: true,
      message: `OPT code has been sent to ${email}`,
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

    if (!isMatched) throw new CustomError("Password is Incorrect", 401);

    const token = findUser.getJwt();
    res
      .cookie("token", token, {
        sameSite: true,
        httpOnly: true,
        expires: new Date(Date.now() + 604800000),
      }) // 7 days
      .json({ success: true, message: `Welcome Back ${findUser.username}` });
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

    if (findUser.otpExpiry < new Date() || findUser.otpCode != otpCode) {
      await findUser.updateOne({ otpExpiry: new Date(Date.now()) });
      throw new CustomError("OTP is Invalid. Please Try Again!", 400);
    }

    // verify OTP to true
    findUser.otpVerified = true;
    await findUser.save();

    const token = findUser.getJwt();
    sendEmail(
      email,
      "Bahir Chalo Account Verified",
      `Congratulations ${findUser.username}. You are Successfully Verified.`
    );
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
    if (findUser.otpVerified)
      throw new CustomError("You are already Verified", 400);

    const otpCode = getOtpCode();
    findUser.otpCode = otpCode;
    findUser.otpExpiry = new Date(Date.now() + 1000 * 60 * 2);
    await findUser.save();

    sendEmail(
      email,
      "Bahir Chalo OTP Verification Code",
      `You OTP code is ${otpCode}`
    );

    return res.status(201).json({
      success: true,
      message: `OPT code has been sent to ${email}`,
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

    // generate uuid
    findUser.passwordResetId = uuidv4();
    findUser.passwordResetExpiry = new Date(Date.now() + 1000 * 60 * 5);
    await findUser.save();

    sendEmail(
      email,
      "Bahir Chalo Password Reset Link",
      `Your password Reset link is https://www.my-app/reset-password/${findUser.passwordResetId}. Please Click on the link to Change Your Password`
    );

    res.status(200).json({
      success: true,
      message: `Reset Link has been Sent to your ${email}`,
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
      message: "Password has been changed Successfully!",
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = (req: Request, res: Response) => {
  // expects a date object
  // res.cookie("token", null, { expires: new Date(Date.now()) });
  res.clearCookie("token");

  res
    .status(200)
    .json({ success: true, message: "You are Successfully Logged Out" });
};
