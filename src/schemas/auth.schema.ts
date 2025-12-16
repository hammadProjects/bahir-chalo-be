import z from "zod";

const strongPassword = z
  .string()
  .min(8, "Password must be atleast 8 characters")
  .regex(/[A-Z]/, "Password must contain atleast 1 upper case letter")
  .regex(/[a-z]/, "Password must contain atleast 1 lower case letter")
  .regex(/[0-9]/, "Password must contain atleast 1 number")
  .regex(/[^A-Za-z0-9]/, "Password must contain atleast 1 special character");

// --------------Body Schemas---------------
export const signUpBodySchema = z.object({
  username: z
    .string()
    .min(8, "Username must be atleast 4 characters")
    .transform(
      (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    ),
  password: strongPassword,
  email: z.email(),
});

export const signInBodySchema = z.object({
  // password: strongPassword,
  password: z.string(),
  email: z.email(),
});

export const forgetPasswordBodySchema = z.object({ email: z.string() });
export const resendOTPBodySchema = z.object({ email: z.string() });

export const verifyOTPBodySchema = z.object({
  otpCode: z
    .string()
    .min(4, "OTP must be exactly 4 characters")
    .max(4, "OTP must be exactly 4 characters"),
  email: z.email(),
});

// ---------------Params Schemas------------
export const resetPasswordParamsSchema = z.object({ token: z.string() });

// ---------------Body Types for Request--------
export type signUpBody = z.infer<typeof signUpBodySchema>;
export type signInBody = z.infer<typeof signInBodySchema>;
export type verifyOTPBody = z.infer<typeof verifyOTPBodySchema>;
export type resendVerifyOTPBody = z.infer<typeof resendOTPBodySchema>;
export type forgetPasswordBody = z.infer<typeof forgetPasswordBodySchema>;
export type resetPasswordBody = z.infer<typeof signInBodySchema>;

// --------------Params Types for Request---------
export type resetPasswordParams = z.infer<typeof resetPasswordParamsSchema>;
