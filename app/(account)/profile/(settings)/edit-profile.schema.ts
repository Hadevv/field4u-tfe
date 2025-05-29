import { z } from "zod";

export const ProfileFormSchema = z.object({
  name: z.string().optional().nullable(),
  email: z.string(),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  bio: z.string().optional(),
});

export const EditPasswordFormSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
});

export type ProfileFormType = z.infer<typeof ProfileFormSchema>;
export type EditPasswordFormType = z.infer<typeof EditPasswordFormSchema>;
