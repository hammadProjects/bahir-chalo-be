import { addMinutes, isBefore } from "date-fns";
import z from "zod";

export const getMyBookingsQuerySchema = z.object({
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
});

export const createBookingParamsSchema = z.object({
  id: z.string(),
});

export const createBookingBodySchema = z
  .object({
    startTime: z
      .string()
      .transform((v) => new Date(v))
      .refine((v) => !isNaN(v.getDate()) && isBefore(v, new Date()), {
        error: "start time is not valid",
      }),
    endTime: z
      .string()
      .transform((v) => new Date(v))
      .refine((v) => !isNaN(v.getDate()) && isBefore(v, new Date()), {
        error: "end time is not valid",
      }),
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      const startTime = addMinutes(data.startTime, 30);
      return isBefore(startTime, data.endTime);
    },
    {
      error: "start time must be before eaactly 30 minutes before end time.",
      path: ["endTime"],
    }
  );

export type getMyBookingsQuery = z.infer<typeof getMyBookingsQuerySchema>;
export type createBookingParams = z.infer<typeof createBookingParamsSchema>;
export type createBookingBody = z.infer<typeof createBookingBodySchema>;
