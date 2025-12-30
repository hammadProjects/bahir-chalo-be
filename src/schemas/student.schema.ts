import z from "zod";
import { countriesList } from "../utils/countriesList";

export const getRoadmapByIdParamsSchema = z.object({
  roadmapId: z.string(),
});

export const generateRoadmapParamsSchema = z.object({
  country: z
    .string()
    .transform(
      (country) =>
        country.charAt(0).toUpperCase() + country.slice(1).toLowerCase()
    )
    .refine(
      (country) => countriesList.includes(country),
      `Country is not valid. Valid countries are ${countriesList.join(", ")}`
    ),
});

export const getAllRoadmapsQuerySchema = z.object({
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

export type getRoadmapByIdParams = z.infer<typeof getRoadmapByIdParamsSchema>;
export type generateRoadmapParams = z.infer<typeof generateRoadmapParamsSchema>;
export type getAllRoadmapsQuery = z.infer<typeof getAllRoadmapsQuerySchema>;
