import { z } from "zod";

export const AnnouncementSchema = z.object({
  title: z
    .string()
    .min(5, "Le titre doit contenir au moins 5 caractères")
    .max(100, "Le titre doit contenir au maximum 100 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(2000, "La description doit contenir au maximum 2000 caractères"),
  fieldId: z.string().min(1, "Veuillez sélectionner un champ"),
  cropTypeId: z.string().min(1, "Veuillez sélectionner un type de culture"),
  quantityAvailable: z
    .number()
    .min(1, "La quantité doit être supérieure à 0")
    .optional(),
  gleaningPeriods: z
    .array(
      z.object({
        from: z.date({
          required_error: "La date de début est requise",
        }),
        to: z.date({
          required_error: "La date de fin est requise",
        }),
      }),
    )
    .min(1, "Veuillez ajouter au moins une période de glanage"),
  images: z.array(z.string().url()).default([]),
});

export type AnnouncementSchemaType = z.infer<typeof AnnouncementSchema>;
