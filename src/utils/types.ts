import { Document } from "mongoose";

// we extended from Document - to make the methods available like .save()
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
  credits: number;
  consultantProfile: {
    bio: string;
    certificateUrl: string;
    experience: number;
    status: "pending" | "approved" | "rejected";
  };
  getJwt: () => string;
}

export interface SignUpData {
  username: string;
  email: string;
  password: string;
}

export interface JwtPayload {
  id: string;
  email: string;
}

export type PlanType = "basic" | "standard" | "premium";

export type TransactionType =
  | "CREDIT_PURCHASE"
  | "APPOINTMENT_DEDUCTION"
  | "APPOINTMENT_EARNING";
