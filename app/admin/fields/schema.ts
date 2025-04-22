import { z } from "zod";

export const CreateFieldSchema = z.object({
  name: z.string().min(1, { message: "nom obligatoire" }),
  city: z.string().min(1, { message: "ville obligatoire" }),
  postalCode: z.string().min(1, { message: "code postal obligatoire" }),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  surface: z.number().optional(),
  farmId: z.string().optional(),
  ownerId: z.string().optional(),
});

export type CreateFieldSchemaType = z.infer<typeof CreateFieldSchema>;

export const UpdateFieldSchema = z
  .object({
    id: z.string().min(1, { message: "id obligatoire" }),
    name: z.string().min(1, { message: "nom obligatoire" }),
    city: z.string().min(1, { message: "ville obligatoire" }),
    postalCode: z.string().min(1, { message: "code postal obligatoire" }),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    surface: z.number().optional(),
    farmId: z.string().optional(),
    ownerId: z.string().optional(),
  })
  .refine(
    (data) => {
      return !!data.farmId || !!data.ownerId;
    },
    {
      message: "soit la ferme soit le propriétaire doit être spécifié",
      path: ["ownerId"],
    },
  );
