import { Request, Response } from "express";
import User from "../models/user.model";
import { getOtpCode } from "../utils/utils";
import { validateSignUp } from "../utils/validation";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export const signUp = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    // implement logic with zod (todo)
    validateSignUp({ username, email, password });

    const otpCode = getOtpCode();
    // send otp to email (todo)
    // connect db(todo)

    const hashedPassword = await bcrypt.hash(password, 10);

    // await User.create({ username, email, password : hashedPassword, otpCode });
    return res.status(201).json({
      success: true,
      message: "User created Successfully!",
      otp: otpCode,
    });
  } catch (error) {
    console.log(error);
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const findUser = await User.findOne({ email });

    if (!findUser)
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });

    const isMatched = await bcrypt.compare(password, findUser.password); // returns boolean
    if (!isMatched)
      return res
        .status(400)
        .json({ success: false, message: "Password is Incorrect" });

    // get jwt_token(todo)
    res
      .cookie("token", "jwt_value")
      .json({ success: true, message: "Welcome Back!" });
  } catch (error) {
    console.log(error);
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { otpCode, email } = req.body;
    const findUser = await User.findOne({ email });

    if (!findUser)
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });

    if (findUser.otpExpiry > new Date())
      return res
        .status(400)
        .json({ success: false, message: "OTP is expired. Please Try Again!" });

    if (findUser.otpCode != otpCode)
      return res
        .status(400)
        .json({ success: false, message: "OTP is Invalid! Please Try Again" });

    // verify OTP to true
    findUser.otpVerified = true;
    await findUser.save();

    // get jwt_token(todo)
    res.cookie("token", "jwt_value").json({
      success: true,
      message: "Welcome! You are successfully Logged In",
    });
  } catch (error) {
    console.log(error);
  }
};

export const forgetPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const findUser = await User.findOne({ email });

    if (!findUser)
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });

    // send resest link as mail(todo)
    // generate uuid
    findUser.passwordResetId = uuidv4();
    findUser.passwordResetExpiry = new Date(Date.now() + 1000 * 60 * 5);
    await findUser.save();

    res.status(200).json({
      success: true,
      message: "Reset Link is Sent to your E-mail",
      link: `https://www.my-app/reset-password/${findUser.passwordResetId}`,
    });
  } catch (error) {
    console.log(error);
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { token } = req.params;

    const findUser = await User.findOne({ email });

    if (!findUser)
      return res
        .status(404)
        .json({ success: false, message: "User Not Found" });

    if (
      findUser.passwordResetExpiry &&
      (findUser.passwordResetExpiry > new Date() ||
        findUser.passwordResetId != token)
    )
      return res.status(400).json({
        success: false,
        message: "Link is expired. Please Try Again!",
      });

    findUser.password = password;
    await findUser.save();

    res.status(200).json({
      success: true,
      message: "Password is changes Successfully!",
    });
  } catch (error) {
    console.log(error);
  }
};
