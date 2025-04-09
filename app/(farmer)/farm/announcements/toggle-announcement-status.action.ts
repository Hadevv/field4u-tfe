"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authAction } from "@/lib/backend/safe-actions";
import { UserRole } from "@prisma/client";

const ToggleAnnouncementStatusSchema = z.object({
  announcementId: z.string(),
  isPublished: z.boolean(),
});

export const toggleAnnouncementStatusAction = authAction
  .schema(ToggleAnnouncementStatusSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    const user = ctx.user;

    // vérification du rôle
    if (user.role !== UserRole.FARMER) {
      throw new Error(
        "Vous devez être agriculteur pour effectuer cette action",
      );
    }

    // récupération de l'annonce pour vérifier qu'elle appartient bien à l'utilisateur
    const announcement = await prisma.announcement.findUnique({
      where: { id: input.announcementId },
    });

    if (!announcement) {
      throw new Error("Annonce non trouvée");
    }

    if (announcement.ownerId !== user.id) {
      throw new Error("Vous n'êtes pas autorisé à modifier cette annonce");
    }

    // mise à jour du statut
    const updatedAnnouncement = await prisma.announcement.update({
      where: { id: announcement.id },
      data: {
        isPublished: input.isPublished,
      },
    });

    return {
      success: true,
      announcement: updatedAnnouncement,
    };
  });
