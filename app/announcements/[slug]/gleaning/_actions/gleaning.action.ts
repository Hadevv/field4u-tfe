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
import { inngest } from "@/lib/inngest/client";

export const joinGleaningAction = authAction
  .schema(JoinGleaningSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    try {
      const announcement = await prisma.announcement.findUnique({
        where: { id: input.announcementId },
        select: {
          startDate: true,
          endDate: true,
          title: true,
        },
      });

      if (!announcement) {
        return {
          success: false,
          error: "Annonce introuvable",
        };
      }

      let gleaning = await prisma.gleaning.findUnique({
        where: { announcementId: input.announcementId },
      });

      if (!gleaning) {
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

      await prisma.participation.create({
        data: {
          userId: ctx.user.id,
          gleaningId: gleaning.id,
        },
      });

      if (announcement.startDate) {
        await inngest.send({
          name: "glanage.joined",
          data: {
            gleaningId: gleaning.id,
            userId: ctx.user.id,
            announcementId: input.announcementId,
            startDate: announcement.startDate,
          },
        });
      }

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
