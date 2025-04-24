"use server";

import { authAction, ActionError } from "@/lib/backend/safe-actions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const nameSchema = z.object({
  name: z
    .string()
    .min(3, "le nom doit contenir au moins 3 caractères")
    .max(30, "le nom ne peut pas dépasser 30 caractères")
    .regex(
      /^[a-z0-9_-]+$/i,
      "le nom ne peut contenir que des lettres, chiffres, tirets et underscores",
    ),
});

export const setName = authAction
  .schema(nameSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    try {
      const updatedUser = await prisma.user.update({
        where: {
          id: ctx.user.id,
        },
        data: {
          name: input.name,
        },
      });

      return { success: true, name: updatedUser.name };
    } catch (error) {
      console.error("erreur lors de la définition du nom:", error);
      throw new ActionError("impossible de définir le nom");
    }
  });
