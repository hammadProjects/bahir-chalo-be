import z from "zod";

export const getConsultantByIdParamsSchema = z.object({
  id: z.string(),
  //   id: z.string().transform((id) => new mongoose.Types.ObjectId(id)),
});

export const getVerifiedConsultantQuerySchema = z.object({
  page: z
    .string()
    .transform((v) => Number(v))
    .refine(
      (v) => Number.isInteger(v) && v >= 1,
      "page number must be positive"
    ),
  limit: z
    .string()
    .transform((v) => Number(v))
    .refine(
      (v) => Number.isInteger(v) && v >= 5 && v <= 10,
      "limit must be a positive"
    ),
  search: z
    .string()
    .optional()
    .default("")
    .transform((v) => v?.trim()),
});

export type getConsultantByIdParams = z.infer<
  typeof getConsultantByIdParamsSchema
>;

export type getVerifiedConsultantIdQuery = z.infer<
  typeof getVerifiedConsultantQuerySchema
>;
