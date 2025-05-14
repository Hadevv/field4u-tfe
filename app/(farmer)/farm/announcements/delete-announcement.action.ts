"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authAction } from "@/lib/backend/safe-actions";
import { UserRole } from "@prisma/client";
import { inngest } from "@/lib/inngest/client";

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
        "vous devez être agriculteur pour effectuer cette action",
      );
    }

    // récupération de l'annonce avec le glanage et les participations
    const announcement = await prisma.announcement.findUnique({
      where: { id: input.announcementId },
      include: {
        gleaning: {
          include: {
            participations: true,
          },
        },
      },
    });

    if (!announcement) {
      throw new Error("annonce non trouvée");
    }

    if (announcement.ownerId !== user.id) {
      throw new Error("vous n'êtes pas autorisé à supprimer cette annonce");
    }

    // si l'annonce a un glanage avec des participants
    if (
      announcement.gleaning &&
      announcement.gleaning.participations.length > 0
    ) {
      // annuler le glanage au lieu de le supprimer
      await prisma.gleaning.update({
        where: { id: announcement.gleaning.id },
        data: { status: "CANCELLED" },
      });

      // envoyer l'event d'annulation au serveur d'inngest pour notification
      await inngest.send({
        name: "glanage.canceled",
        data: {
          gleaningId: announcement.gleaning.id,
          announcementTitle: announcement.title,
          announcementId: announcement.id,
        },
      });

      return {
        success: true,
        cancelled: true,
      };
    } else {
      // pas de participants, on peut supprimer complètement

      // supprimer le glanage et les participations si existants
      if (announcement.gleaning) {
        const gleaningId = announcement.gleaning.id;

        // supprimer les participations
        await prisma.participation.deleteMany({
          where: { gleaningId },
        });

        // supprimer les avis
        await prisma.review.deleteMany({
          where: { gleaningId },
        });

        // supprimer les messages
        await prisma.message.deleteMany({
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

      return {
        success: true,
        deleted: true,
      };
    }
  });
