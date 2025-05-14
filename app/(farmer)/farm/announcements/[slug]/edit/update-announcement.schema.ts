import { z } from "zod";

export const UpdateAnnouncementSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(10).max(2000),
  fieldId: z.string(),
  cropTypeId: z.string(),
  quantityAvailable: z.number().optional(),
  suggestedPrice: z.number().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  images: z.array(z.string()).optional(),
  imageFiles: z.any().optional(),
  announcementId: z.string(),
});

export type UpdateAnnouncementType = z.infer<typeof UpdateAnnouncementSchema>;
