import { z } from "zod";

export const CancelGleaningSchema = z.object({
  gleaningId: z.string(),
  announcementId: z.string(),
});

export type CancelGleaningType = z.infer<typeof CancelGleaningSchema>;
