import { z } from "zod";

export const ToggleAnnouncementStatusSchema = z.object({
  announcementId: z.string(),
  isPublished: z.boolean(),
});

export type ToggleAnnouncementStatusSchemaType = z.infer<
  typeof ToggleAnnouncementStatusSchema
>;
