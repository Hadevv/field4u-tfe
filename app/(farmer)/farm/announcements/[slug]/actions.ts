"use server";

import { authAction } from "@/lib/backend/safe-actions";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { inngest } from "@/lib/inngest/client";

export const CancelGleaningSchema = z.object({
  gleaningId: z.string(),
  announcementId: z.string(),
});

export const cancelGleaningAction = authAction
  .schema(CancelGleaningSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    try {
      const gleaning = await prisma.gleaning.findUnique({
        where: { id: input.gleaningId },
      });

      if (!gleaning) {
        return {
          success: false,
          error: "glanage introuvable",
        };
      }

      const announcement = await prisma.announcement.findUnique({
        where: { id: input.announcementId },
        select: {
          title: true,
          ownerId: true,
        },
      });

      if (!announcement) {
        return {
          success: false,
          error: "annonce introuvable",
        };
      }

      if (announcement.ownerId !== ctx.user.id) {
        return {
          success: false,
          error: "vous n'êtes pas autorisé à annuler ce glanage",
        };
      }

      await prisma.gleaning.update({
        where: { id: input.gleaningId },
        data: { status: "CANCELLED" },
      });

      // envoyer l'event d'annulation au serveur d'inngest
      await inngest.send({
        name: "glanage.canceled",
        data: {
          gleaningId: input.gleaningId,
          announcementTitle: announcement.title,
          announcementId: input.announcementId,
        },
      });

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: "une erreur est survenue lors de l'annulation du glanage",
      };
    }
  });
