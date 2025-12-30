import bcrypt from "bcrypt";
import { CustomError } from "../middlewares/error";
import User from "../models/user.model";
import * as authSchema from "../schemas/auth.schema";
import { getOtpCode, SAFE_USER_SELECT } from "../utils/utils";
import { sendEmail } from "../utils/email";
import { v4 as uuidv4 } from "uuid";
import { UserDocument } from "../utils/types";

export const sendOtpToUser = async (
  user: UserDocument,
  reason: "verify" | "reset"
) => {
  let subject: string;
  let body: string;
  let code, expiry;

  if (reason === "verify") {
    const otpCode = getOtpCode();

    user.otpCode = otpCode;
    user.otpExpiry = new Date(Date.now() + 1000 * 60 * 5);

    subject = "Bahir Chalo OTP Verification Code";
    body = `Your OTP code is ${otpCode}`;
  } else {
    const resetToken = uuidv4();

    user.passwordResetId = resetToken;
    user.passwordResetExpiry = new Date(Date.now() + 1000 * 60 * 5);

    subject = "Bahir Chalo Password Reset Link";
    body = `Your password reset link is ${process.env.FRONTEND_URL}/reset-password/${resetToken}. Please click the link to change your password.`;
  }

  await user.save();
  sendEmail(user.email, subject, body);
};

export const signUp = async ({
  username,
  email,
  password,
}: authSchema.signUpBody) => {
  const findUser = await User.findOne({ email });
  if (findUser)
    throw new CustomError("User with this email already exisits", 400);

  const otpCode = getOtpCode();
  const otpExpiry = new Date(new Date().getMinutes() + 5);

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    otpCode,
    otpExpiry,
  });

  sendEmail(
    email,
    "Bahir Chalo OTP Verification Code",
    `Your OTP code is ${otpCode}`
  );
  await user.save();
};

export const signIn = async ({ email, password }: authSchema.signInBody) => {
  const findUser = await User.findOne({ email });

  if (!findUser) throw new CustomError("User Not Found", 404);

  // returns boolean
  const isMatched = await bcrypt.compare(password, findUser.password);

  if (!isMatched) throw new CustomError("Password is Incorrect", 401);

  if (findUser.otpVerified == false) {
    await sendOtpToUser(findUser, "verify");
    throw new CustomError("Please Verify your email with OTP", 401);
  }

  const token = findUser.getJwt();
  const safeUserSelect = await User.findById(findUser._id).select(
    SAFE_USER_SELECT
  );

  return { token, user: safeUserSelect };
};

export const verifyOtp = async ({
  otpCode,
  email,
}: authSchema.verifyOTPBody) => {
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

  return { token, user: findUser };
};

export const resendVerifyOtp = async ({
  email,
}: authSchema.resendVerifyOTPBody) => {
  const findUser = await User.findOne({ email });
  if (!findUser) throw new CustomError("User Not Found", 404);
  if (findUser.otpVerified)
    throw new CustomError("You are already Verified", 400);

  await sendOtpToUser(findUser, "verify");
  return { user: findUser };
};

export const forgotPassword = async ({
  email,
}: authSchema.forgetPasswordBody) => {
  const findUser = await User.findOne({ email });
  if (!findUser) throw new CustomError("User Not Found", 404);

  sendOtpToUser(findUser, "reset");
};

// change type here
export const resetPassword = async ({
  email,
  password,
  token,
}: authSchema.resetPasswordParams & authSchema.resetPasswordBody) => {
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
};
