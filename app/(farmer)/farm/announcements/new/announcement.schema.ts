import { z } from "zod";

export const DateRangeSchema = z
  .object({
    from: z.date({
      required_error: "La date de début est requise",
      invalid_type_error: "Format de date invalide",
    }),
    to: z.date({
      required_error: "La date de fin est requise",
      invalid_type_error: "Format de date invalide",
    }),
  })
  .refine((data) => data.from < data.to, {
    message: "La date de fin doit être après la date de début",
    path: ["to"],
  })
  .refine((data) => data.from >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: "La date de début ne peut pas être dans le passé",
    path: ["from"],
  });

export const AnnouncementSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  description: z
    .string()
    .min(20, "La description doit contenir au moins 20 caractères"),
  fieldId: z.string().min(1, "Veuillez sélectionner un champ"),
  cropTypeId: z.string().min(1, "Veuillez sélectionner un type de culture"),
  quantityAvailable: z
    .number()
    .min(1, "La quantité doit être supérieure à 0")
    .optional(),
  gleaningPeriods: z
    .array(DateRangeSchema)
    .min(1, "Veuillez ajouter au moins une période de glanage"),
  images: z.array(z.string()).optional(),
});

export type AnnouncementSchemaType = z.infer<typeof AnnouncementSchema>;
