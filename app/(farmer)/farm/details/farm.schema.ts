import { z } from "zod";

export const FarmSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  city: z.string().min(2, "La ville est requise"),
  postalCode: z.string().min(4, "Le code postal est requis"),
  contactInfo: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export type FarmSchemaType = z.infer<typeof FarmSchema>;
