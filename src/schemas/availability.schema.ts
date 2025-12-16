import z from "zod";

export const setAvailabilityBodySchema = z.object({
  startTime: z
    .string()
    .transform((time) => new Date(time))
    .refine((time) => !isNaN(time.getTime())),
  endTime: z
    .string()
    .transform((time) => new Date(time))
    .refine((time) => !isNaN(time.getTime())),
});

// export const setAvailabilityParamsSchema = z.object({

// });

export type setAvailabilityBody = z.infer<typeof setAvailabilityBodySchema>;
// export type setAvailabilityParams = z.infer<typeof setAvailabilityParamsSchema>;
