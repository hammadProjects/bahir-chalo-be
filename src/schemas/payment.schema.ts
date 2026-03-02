import { z } from "zod";

export const buyCreditSchema = z
  .object({
    planType: z.enum(["basic", "standard", "premium"], {
      error: "Plan type must be 'basic', 'standard', or 'premium'",
    }),
  })
  .strict();

export const payoutCreditsSchema = z
  .object({
    creditsToCheckout: z
      .number({ error: "credits must be numeric" })
      .min(1, "At least 1 credit is required")
      .int("Credits must be a whole number"),
  })
  .strict();

export const verifyPaymentSchema = z
  .object({
    sessionId: z.string().min(1, "Session ID is required"),
  })
  .strict();

export type BuyCreditRequest = z.infer<typeof buyCreditSchema>;
export type PayoutCreditsRequest = z.infer<typeof payoutCreditsSchema>;
export type VerifyPaymentRequest = z.infer<typeof verifyPaymentSchema>;
