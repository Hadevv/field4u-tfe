import { z } from "zod";
import { UserRole, Language, UserPlan } from "@prisma/client";

export const CreateUserSchema = z.object({
  name: z.string().min(1, { message: "nom obligatoire" }),
  email: z.string().email({ message: "email invalide" }),
  role: z.nativeEnum(UserRole),
  language: z.nativeEnum(Language).default(Language.FRENCH),
  plan: z.nativeEnum(UserPlan).default(UserPlan.FREE),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  bio: z.string().optional(),
});

export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>;

export const UpdateUserSchema = z.object({
  id: z.string().min(1, { message: "id obligatoire" }),
  name: z.string().min(1, { message: "nom obligatoire" }),
  email: z.string().email({ message: "email invalide" }),
  role: z.nativeEnum(UserRole),
  language: z.nativeEnum(Language),
  plan: z.nativeEnum(UserPlan),
  city: z.string().optional(),
  postalCode: z.string().optional(),
  bio: z.string().optional(),
});
