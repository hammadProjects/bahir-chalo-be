import mongoose from "mongoose";
import z from "zod";
import { baseRequestSchema } from "./baseRequestSchema";

const verifyConsultantBodySchema = z.object({
  status: z.enum(
    ["approved", "rejected"],
    "Status is invalid. Status must be accepted or rejected."
  ),
});

const verifyConsultantParamsSchema = z.object({
  id: z.string().transform((id) => new mongoose.Types.ObjectId(id)),
});

export const verifyConsultantSchema = z.object({
  ...baseRequestSchema,
  body: verifyConsultantBodySchema,
  params: verifyConsultantParamsSchema,
});

export type verifyConsultantBody = z.infer<typeof verifyConsultantBodySchema>;
export type verifyConsultantParams = z.infer<
  typeof verifyConsultantParamsSchema
>;
