"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authAction } from "@/lib/backend/safe-actions";
import { UserRole } from "@prisma/client";

const DeleteAnnouncementSchema = z.object({
  announcementId: z.string(),
});

export const deleteAnnouncementAction = authAction
  .schema(DeleteAnnouncementSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    const user = ctx.user;

    // vérification du role
    if (user.role !== UserRole.FARMER) {
      throw new Error(
        "Vous devez être agriculteur pour effectuer cette action",
      );
    }

    // récupération de lannonce pour vérifier qu'elle appartient bien à l'utilisateur
    const announcement = await prisma.announcement.findUnique({
      where: { id: input.announcementId },
      include: {
        gleaning: true,
      },
    });

    if (!announcement) {
      throw new Error("Annonce non trouvée");
    }

    if (announcement.ownerId !== user.id) {
      throw new Error("Vous n'êtes pas autorisé à supprimer cette annonce");
    }

    // supprimer d'abord les associations
    await prisma.announcementGleaningPeriod.deleteMany({
      where: { announcementId: announcement.id },
    });

    // supprimer le glanage et les participations si existants
    if (announcement.gleaning.length > 0) {
      const gleaningId = announcement.gleaning[0].id;

      // supprimer les participations
      await prisma.participation.deleteMany({
        where: { gleaningId },
      });

      // supprimer les avis
      await prisma.review.deleteMany({
        where: { gleaningId },
      });

      // supprimer le glanage
      await prisma.gleaning.delete({
        where: { id: gleaningId },
      });
    }

    // supprimer les favoris et likes
    await prisma.favorite.deleteMany({
      where: { announcementId: announcement.id },
    });

    await prisma.like.deleteMany({
      where: { announcementId: announcement.id },
    });

    // supprimer l'annonce
    await prisma.announcement.delete({
      where: { id: announcement.id },
    });

    return { success: true };
  });
