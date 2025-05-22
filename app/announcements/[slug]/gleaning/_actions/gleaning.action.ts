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
import { sendNotificationToUser } from "@/lib/notifications/sendNotification";
import { NotificationType } from "@prisma/client";
import { revalidatePath } from "next/cache";

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
          slug: true,
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
        // Rafraîchir les pages concernées
        revalidatePath(`/announcements`);
        revalidatePath(`/announcements/${announcement.slug}`);
        revalidatePath(`/announcements/${announcement.slug}/gleaning`);
        revalidatePath(`/my-gleanings`);

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

      // notification à l'agriculteur (owner de l'annonce)
      const announcementOwner = await prisma.announcement.findUnique({
        where: { id: input.announcementId },
        select: { ownerId: true, title: true },
      });
      if (announcementOwner?.ownerId) {
        await sendNotificationToUser(
          announcementOwner.ownerId,
          NotificationType.PARTICIPATION_JOINED,
          `un glaneur a rejoint votre glanage sur "${announcementOwner.title ?? ""}"`,
        );
      }

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

      // Rafraîchir les pages concernées
      revalidatePath(`/announcements`);
      revalidatePath(`/announcements/${announcement.slug}`);
      revalidatePath(`/announcements/${announcement.slug}/gleaning`);
      revalidatePath(`/my-gleanings`);

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
          include: {
            gleaning: {
              include: {
                announcement: {
                  select: {
                    slug: true,
                  },
                },
              },
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

        // Récupérer le slug pour la revalidation
        const slug = participation.gleaning?.announcement?.slug;

        // Rafraîchir les pages concernées
        revalidatePath(`/announcements`);
        if (slug) {
          revalidatePath(`/announcements/${slug}`);
          revalidatePath(`/announcements/${slug}/gleaning`);
        }
        revalidatePath(`/my-gleanings`);

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
