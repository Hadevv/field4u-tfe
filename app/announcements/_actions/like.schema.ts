import { z } from "zod";

export const LikeAnnouncementSchema = z.object({
  announcementId: z.string().min(1, "L'ID de l'annonce est requis"),
});

export type LikeAnnouncementInput = z.infer<typeof LikeAnnouncementSchema>;
