import z from "zod";
import { baseRequestSchema } from "./baseRequestSchema";

const strongPassword = z
  .string()
  .min(8, "Password must be atleast 4 characters")
  .regex(/[A-Z]/, "Password must contain atleast 1 upper case letter")
  .regex(/[a-z]/, "Password must contain atleast 1 lower case letter")
  .regex(/[0-9]/, "Password must contain atleast 1 number")
  .regex(/[^A-Za-z0-9]/, "Password must contain atleast 1 special character");

// --------------Body Schemas---------------
const signUpBodySchema = z.object({
  username: z
    .string()
    .min(8, "Username must be atleast 4 characters")
    .transform(
      (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    ),
  password: strongPassword,
  email: z.email(),
});

const signInBodySchema = z.object({
  password: strongPassword,
  email: z.email(),
});

const forgetPasswordBodySchema = z.object({ email: z.string() });
const resendVerifyOTPBodySchema = z.object({ email: z.string() });

const verifyOTPBodySchema = z.object({
  otpCode: z
    .string()
    .min(4, "OTP must be exactly 4 characters")
    .max(4, "OTP must be exactly 4 characters"),
  email: z.email(),
});

// ---------------Params Schemas------------

const resetPasswordParamsSchema = z.object({ token: z.string() });

// ---------------Request Schemas-----------
export const signUpSchema = z.object({
  ...baseRequestSchema,
  body: signUpBodySchema,
});

export const signInSchema = z.object({
  ...baseRequestSchema,
  body: signInBodySchema,
});

export const verifyOTPSchema = z.object({
  ...baseRequestSchema,
  body: verifyOTPBodySchema,
});

export const forgetPasswordSchema = z.object({
  ...baseRequestSchema,
  body: forgetPasswordBodySchema,
});

export const resendOTPSchema = z.object({
  ...baseRequestSchema,
  body: resendVerifyOTPBodySchema,
});

export const resetPasswordSchema = z.object({
  ...baseRequestSchema,
  body: signInBodySchema,
  params: resetPasswordParamsSchema,
});

// ---------------Body Types for Request--------
export type signUpBody = z.infer<typeof signUpBodySchema>;
export type signInBody = z.infer<typeof signInBodySchema>;
export type verifyOTPBody = z.infer<typeof verifyOTPBodySchema>;
export type resendVerifyOTPBody = z.infer<typeof resendVerifyOTPBodySchema>;
export type forgetPasswordBody = z.infer<typeof forgetPasswordBodySchema>;
export type resetPasswordBody = z.infer<typeof signInBodySchema>;

// --------------Params Types for Request---------
export type resetPasswordParams = z.infer<typeof resetPasswordParamsSchema>;
