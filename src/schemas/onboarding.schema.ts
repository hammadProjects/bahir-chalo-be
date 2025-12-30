import z from "zod";
import { countriesList } from "../utils/countriesList";

export const studentOnboardingBodySchema = z.object({
  recentDegree: z.string().min(4, "Degree must be atleast 4 characters"),
  grades: z
    .string()
    .transform((grade) => Number(grade))
    .refine((grade) => !isNaN(grade), "Grades must be numberic"),
  homeCountry: z
    .string()
    .transform(
      (country) =>
        country.charAt(0).toUpperCase() + country.slice(1).toLowerCase()
    )
    .refine(
      (country) => countriesList.includes(country),
      `Country is not valid. Valid countries are ${countriesList.join(", ")}`
    ),
  ieltsScore: z
    .string()
    .transform((score) => Number(score))
    .refine((score) => !isNaN(score), "Ielts score must be a number"),
  budget: z
    .string()
    .refine((val) => !isNaN(Number(val)), "Budget must be a numeric value")
    .transform((val) => Number(val)),
  courses: z.array(
    z.string().min(4, "Each course must be atleast 4 characters")
  ),
});

export const consultantOnboardingBodySchema = z.object({
  bio: z.string().min(4, "Bio must be atleast 4 characters"),
  certificateUrl: z.url("Certificate URL is invalid."),
  experience: z
    .string()
    .transform((exp) => Number(exp))
    .refine((exp) => !isNaN(exp), "Experience must be numberic")
    .refine((exp) => exp <= 0, "At least 1 year experience is required."),
});

export type studentOnboardingBody = z.infer<typeof studentOnboardingBodySchema>;
export type consultantOnboardingBody = z.infer<
  typeof consultantOnboardingBodySchema
>;
