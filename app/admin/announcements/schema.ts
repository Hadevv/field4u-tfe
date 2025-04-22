import { z } from "zod";

export const CreateAnnouncementSchema = z.object({
  title: z.string().min(1, { message: "titre obligatoire" }),
  description: z.string().min(10, { message: "description trop courte" }),
  fieldId: z.string().min(1, { message: "champ obligatoire" }),
  cropTypeId: z.string().min(1, { message: "type de culture obligatoire" }),
  quantityAvailable: z.number().optional(),
  ownerId: z.string().min(1, { message: "propriétaire obligatoire" }),
  isPublished: z.boolean().default(true),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  images: z.array(z.string()).optional(),
});

export type CreateAnnouncementSchemaType = z.infer<
  typeof CreateAnnouncementSchema
>;

export const UpdateAnnouncementSchema = z.object({
  id: z.string().min(1, { message: "id obligatoire" }),
  title: z.string().min(1, { message: "titre obligatoire" }),
  description: z.string().min(10, { message: "description trop courte" }),
  fieldId: z.string().min(1, { message: "champ obligatoire" }),
  cropTypeId: z.string().min(1, { message: "type de culture obligatoire" }),
  quantityAvailable: z.number().optional(),
  ownerId: z.string().min(1, { message: "propriétaire obligatoire" }),
  isPublished: z.boolean(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  images: z.array(z.string()).optional(),
});

export type UpdateAnnouncementSchemaType = z.infer<
  typeof UpdateAnnouncementSchema
>;
