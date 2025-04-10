import { z } from "zod";

export const FieldSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  city: z.string().min(2, "La ville est requise"),
  postalCode: z.string().min(4, "Le code postal est requis"),
  surface: z
    .number()
    .min(0.01, "La surface doit être supérieure à 0")
    .optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  farmId: z.string().optional(),
});

export type FieldSchemaType = z.infer<typeof FieldSchema>;
