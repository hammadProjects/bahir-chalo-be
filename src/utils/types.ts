import { NextFunction, Request, Response } from "express";
import { Document } from "mongoose";

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  otpCode: string;
  otpExpiry: Date;
  otpVerified: boolean;
  passwordResetId: string;
  passwordResetExpiry: Date;
  role: "student" | "consultant" | "admin" | "unassigned";
  consultantProfile: {
    bio: string;
    certificateUrl: string;
    status: "pending" | "approved" | "rejected";
  };
  getJwt: (req: Request, res: Response, next: NextFunction) => string;
}

export interface SignUpData {
  username: string;
  email: string;
  password: string;
}
