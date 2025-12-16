import z from "zod";

export const baseRequestSchema = z.object({
  body: z.object({}).optional(), // Keep `body` as optional, but don't wrap it
  params: z.object({}).optional(), // Same for params
  query: z.object({}).optional(), // Same for query
});
