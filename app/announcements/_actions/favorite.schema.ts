import { z } from "zod";

export const FavoriteAnnouncementSchema = z.object({
  announcementId: z.string().min(1, "L'ID de l'annonce est requis"),
});

export type FavoriteAnnouncementInput = z.infer<
  typeof FavoriteAnnouncementSchema
>;
