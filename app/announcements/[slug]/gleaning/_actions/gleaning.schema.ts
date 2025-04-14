import { z } from "zod";

export const JoinGleaningSchema = z.object({
  announcementId: z.string().min(1, "L'identifiant de l'annonce est requis"),
});

export type JoinGleaningSchemaType = z.infer<typeof JoinGleaningSchema>;

export type JoinGleaningResponse = {
  success: boolean;
  error?: string;
  gleaningId?: string;
  alreadyParticipating?: boolean;
};

export const LeaveGleaningSchema = z.object({
  gleaningId: z.string().min(1, "L'identifiant du glanage est requis"),
});

export type LeaveGleaningSchemaType = z.infer<typeof LeaveGleaningSchema>;

export type LeaveGleaningResponse = {
  success: boolean;
  error?: string;
};

export const UpdateGleaningStatusSchema = z.object({
  gleaningId: z.string().min(1, "l'identifiant du glanage est requis"),
});

export type UpdateGleaningStatusSchemaType = z.infer<
  typeof UpdateGleaningStatusSchema
>;

export type UpdateGleaningStatusResponse = {
  success: boolean;
  error?: string;
  newStatus?: string;
};
