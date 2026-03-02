import z from "zod";

export const pendingTransactionsQuerySchema = z
  .object({
    status: z.literal("pending"),
    type: z.literal("PAYOUT_REQUEST"),
  })
  .strict();
