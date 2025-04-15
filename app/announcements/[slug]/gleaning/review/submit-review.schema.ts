import { z } from "zod";

export const ReviewSchema = z.object({
  gleaningId: z.string(),
  rating: z.number().int().min(1).max(5),
  content: z.string().min(3).max(500),
  images: z.array(z.string()).optional(),
  imageFiles: z.instanceof(FormData).optional(),
});
