/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { authAction } from "@/lib/backend/safe-actions";
import { prisma } from "@/lib/prisma";
import {
  JoinGleaningSchema,
  LeaveGleaningSchema,
  type LeaveGleaningResponse,
} from "./gleaning.schema";
import { GleaningStatus } from "@prisma/client";

export const joinGleaningAction = authAction
  .schema(JoinGleaningSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    try {
      // récupérer l'annonce pour vérifier les dates
      const announcement = await prisma.announcement.findUnique({
        where: { id: input.announcementId },
        select: {
          startDate: true,
          endDate: true,
        },
      });

      if (!announcement) {
        return {
          success: false,
          error: "Annonce introuvable",
        };
      }

      // verifier si un glanage existe déjà
      let gleaning = await prisma.gleaning.findUnique({
        where: { announcementId: input.announcementId },
      });

      // si non, créer un nouveau glanage
      if (!gleaning) {
        // déterminer le statut initial du glanage en fonction des dates
        let initialStatus: GleaningStatus = "NOT_STARTED";

        if (announcement.startDate && announcement.endDate) {
          const now = new Date();

          if (now > announcement.endDate) {
            initialStatus = "COMPLETED";
          } else if (now >= announcement.startDate) {
            initialStatus = "IN_PROGRESS";
          }
        }

        gleaning = await prisma.gleaning.create({
          data: {
            announcementId: input.announcementId,
            status: initialStatus,
          },
        });
      }

      // verifier si l'utilisateur participe déjà
      const existingParticipation = await prisma.participation.findUnique({
        where: {
          userId_gleaningId: {
            userId: ctx.user.id,
            gleaningId: gleaning.id,
          },
        },
      });

      if (existingParticipation) {
        return {
          success: true,
          gleaningId: gleaning.id,
          alreadyParticipating: true,
        };
      }

      // ajouter l'utilisateur comme participant
      await prisma.participation.create({
        data: {
          userId: ctx.user.id,
          gleaningId: gleaning.id,
        },
      });

      return {
        success: true,
        gleaningId: gleaning.id,
      };
    } catch (error) {
      return {
        success: false,
        error: "Une erreur est survenue lors de la participation au glanage",
      };
    }
  });

export const leaveGleaningAction = authAction
  .schema(LeaveGleaningSchema)
  .action(
    async ({ parsedInput: input, ctx }): Promise<LeaveGleaningResponse> => {
      try {
        // verifier si l'utilisateur participe
        const participation = await prisma.participation.findUnique({
          where: {
            userId_gleaningId: {
              userId: ctx.user.id,
              gleaningId: input.gleaningId,
            },
          },
        });

        if (!participation) {
          return {
            success: false,
            error: "Vous ne participez pas à ce glanage",
          };
        }

        // supprimer la participation
        await prisma.participation.delete({
          where: {
            id: participation.id,
          },
        });

        return {
          success: true,
        };
      } catch (error) {
        return {
          success: false,
          error:
            "Une erreur est survenue lors de l'annulation de la participation",
        };
      }
    },
  );
