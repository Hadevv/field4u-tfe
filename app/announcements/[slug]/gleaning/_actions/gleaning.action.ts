/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { authAction } from "@/lib/backend/safe-actions";
import { prisma } from "@/lib/prisma";
import {
  JoinGleaningSchema,
  type JoinGleaningResponse,
  LeaveGleaningSchema,
  type LeaveGleaningResponse,
} from "./gleaning.schema";

export const joinGleaningAction = authAction
  .schema(JoinGleaningSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    try {
      // Vérifier si un glanage existe déjà
      let gleaning = await prisma.gleaning.findUnique({
        where: { announcementId: input.announcementId },
      });

      // Si non, créer un nouveau glanage
      if (!gleaning) {
        gleaning = await prisma.gleaning.create({
          data: {
            announcementId: input.announcementId,
            status: "PENDING",
          },
        });
      }

      // Vérifier si l'utilisateur participe déjà
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
          success: false,
          error: "Vous participez déjà à ce glanage",
        };
      }

      // Ajouter l'utilisateur comme participant
      await prisma.participation.create({
        data: {
          userId: ctx.user.id,
          gleaningId: gleaning.id,
          status: "CONFIRMED",
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
        // Vérifier si l'utilisateur participe
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

        // Supprimer la participation
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
