import { z } from "zod";

export const FarmFormSchema = z.object({
  name: z.string().min(4, "Le nom doit contenir au moins 4 caractères"),
  city: z
    .string()
    .min(2, "Veuillez sélectionner une commune valide")
    .optional(),
  postalCode: z
    .string()
    .length(4, "Code postal belge invalide (4 chiffres requis)")
    .refine((val) => /^[1-9]\d{3}$/.test(val), "Code postal invalide")
    .optional(),
  description: z.string().max(500, "Description trop longue").optional(),
  contactInfo: z
    .string()
    .email("Email invalide")
    .or(z.string().regex(/^\+?[0-9\s]+$/, "Numéro invalide"))
    .optional(),
  termsAcceptedAt: z.date().optional().nullable(),
});

export const GleanerFormSchema = z.object({
  bio: z.string().max(500).optional(),
  city: z
    .string()
    .min(2, "Veuillez sélectionner une commune valide")
    .optional(),
  postalCode: z
    .string()
    .length(4, "Code postal belge invalide (4 chiffres requis)")
    .refine((val) => /^[1-9]\d{3}$/.test(val), "Code postal invalide")
    .optional(),
  acceptGeolocation: z.boolean().optional(),
  termsAcceptedAt: z.date().optional().nullable(),
});

export const RulesSchema = z.object({
  rulesAcceptedAt: z.date().nullable().optional(),
});

export type GleanerFormType = z.infer<typeof GleanerFormSchema>;
export type FarmFormType = z.infer<typeof FarmFormSchema>;
export type RulesType = z.infer<typeof RulesSchema>;
