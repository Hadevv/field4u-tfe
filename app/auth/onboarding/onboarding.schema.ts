import { z } from "zod";

export const FarmFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  city: z.string().min(2, "Ville invalide").optional(),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, "Code postal invalide")
    .optional(),
  description: z.string().max(500, "Description trop longue").optional(),
  contactInfo: z
    .string()
    .email("Email invalide")
    .or(z.string().regex(/^\+?[0-9\s]+$/, "Numéro invalide"))
    .optional(),
});

export const GleanerFormSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  bio: z
    .string()
    .max(300, "La bio ne doit pas dépasser 300 caractères")
    .optional(),
  city: z.string().min(2, "Ville requise"),
  postalCode: z.string().regex(/^\d{5}$/, "Code postal invalide"),
  acceptTerms: z
    .boolean()
    .refine((v) => v, "Vous devez accepter les conditions"),
});

export type GleanerFormType = z.infer<typeof GleanerFormSchema>;
export type FarmFormType = z.infer<typeof FarmFormSchema>;
