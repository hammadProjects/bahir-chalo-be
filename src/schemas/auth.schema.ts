import z from "zod";

const passwordError =
  "Password must be atleast 8 characters, containing upper/lower case letter,number adn special characters";

const strongPassword = z
  .string()
  .min(8, passwordError)
  .regex(/[A-Z]/, passwordError)
  .regex(/[a-z]/, passwordError)
  .regex(/[0-9]/, passwordError)
  .regex(/[^A-Za-z0-9]/, passwordError);

// --------------Body Schemas---------------
export const signUpBodySchema = z.object({
  username: z
    .string()
    .min(2, "Username must be atleast 4 characters")
    .transform(
      (name) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase(),
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
