import { z } from "zod";

export const studentProfileSchema = z
  .object({
    recentDegree: z.string().optional(),
    grades: z.number().optional(),
    // homeCountry: z.string().optional(),
    budget: z.number().optional(),
    ieltsScore: z.string().optional(),
    profilePicture: z.url().optional(),
  })
  .strict();

export const consultantProfileSchema = z
  .object({
    bio: z.string().min(10, "Bio must be at least 10 characters"),
    profilePicture: z.url().optional(),
  })
  .strict(); // can only change the things which are in the schema

export type studentProfile = z.infer<typeof studentProfileSchema>;
export type consultantProfile = z.infer<typeof consultantProfileSchema>;
