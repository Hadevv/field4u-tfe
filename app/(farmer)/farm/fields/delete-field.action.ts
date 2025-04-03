"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authAction } from "@/lib/backend/safe-actions";
import { UserRole } from "@prisma/client";

const DeleteFieldSchema = z.object({
  fieldId: z.string(),
});

export const deleteFieldAction = authAction
  .schema(DeleteFieldSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    const user = ctx.user;

    // Vérification du rôle
    if (user.role !== UserRole.FARMER) {
      throw new Error(
        "Vous devez être agriculteur pour effectuer cette action",
      );
    }

    // Récupération du champ pour vérifier qu'il appartient bien à l'utilisateur
    const field = await prisma.field.findUnique({
      where: { id: input.fieldId },
      include: {
        farm: true,
      },
    });

    if (!field) {
      throw new Error("Champ non trouvé");
    }

    // Vérifier que le champ appartient à l'utilisateur ou à une de ses exploitations
    const isOwner = field.ownerId === user.id;
    const isFarmOwner = field.farm && field.farm.ownerId === user.id;

    if (!isOwner && !isFarmOwner) {
      throw new Error("Vous n'êtes pas autorisé à supprimer ce champ");
    }

    // Supprimer toutes les annonces liées au champ
    await prisma.announcement.deleteMany({
      where: { fieldId: field.id },
    });

    // Supprimer le champ
    await prisma.field.delete({
      where: { id: field.id },
    });

    return { success: true };
  });
