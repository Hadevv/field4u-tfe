import { z } from "zod";

export const SendMessageSchema = z.object({
  gleaningId: z.string(),
  type: z.enum(["GROUP", "OWNER"]),
  content: z.string().min(1).max(2000),
});

export type SendMessageSchemaType = z.infer<typeof SendMessageSchema>;
