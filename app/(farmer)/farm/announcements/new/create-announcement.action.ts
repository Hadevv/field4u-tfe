/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { authAction } from "@/lib/backend/safe-actions";
import { isFarmer } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { AnnouncementSchema } from "./announcement.schema";
import { GleaningPeriodStatus } from "@prisma/client";
import { nanoid } from "nanoid";

export const createAnnouncementAction = authAction
  .schema(AnnouncementSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    // vérifier que l'utilisateur est bien un agriculteur
    try {
      await isFarmer();
    } catch (error) {
      throw new Error("Vous n'avez pas les droits pour créer une annonce");
    }
    const user = ctx.user;

    try {
      // vérifier que le champ appartient bien à l'agriculteur
      const field = await prisma.field.findFirst({
        where: {
          id: input.fieldId,
          OR: [
            { ownerId: user.id },
            {
              farm: {
                ownerId: user.id,
              },
            },
          ],
        },
      });

      if (!field) {
        throw new Error("Ce champ n'existe pas ou ne vous appartient pas");
      }

      // Création des périodes de glanage
      const gleaningPeriods = await Promise.all(
        input.gleaningPeriods.map(async (period) => {
          const gleaningPeriod = await prisma.gleaningPeriod.create({
            data: {
              startDate: period.from,
              endDate: period.to,
              status: GleaningPeriodStatus.AVAILABLE,
            },
          });
          return gleaningPeriod;
        }),
      );

      // Création de l'annonce
      const announcement = await prisma.announcement.create({
        data: {
          title: input.title,
          description: input.description,
          fieldId: input.fieldId,
          cropTypeId: input.cropTypeId,
          quantityAvailable: input.quantityAvailable || null,
          slug: nanoid(6),
          ownerId: user.id,
          isPublished: true,
          images: input.images || [],
          gleaningPeriods: {
            create: gleaningPeriods.map((period) => ({
              gleaningPeriodId: period.id,
            })),
          },
        },
        include: {
          gleaningPeriods: {
            include: {
              gleaningPeriod: true,
            },
          },
        },
      });

      // Créer un glanage associé à l'annonce (pour les participations)
      await prisma.gleaning.create({
        data: {
          announcementId: announcement.id,
          status: "PENDING",
        },
      });

      // mettre à jour les statistiques de l'agriculteur
      await prisma.statistic.upsert({
        where: { id: user.id },
        update: {
          totalAnnouncements: { increment: 1 },
        },
        create: {
          userId: user.id,
          totalAnnouncements: 1,
        },
      });

      // rafraîchir la page des annonces
      revalidatePath("/farm/announcements");

      return { success: true, announcementId: announcement.id };
    } catch (error: any) {
      console.error("Erreur lors de la création de l'annonce:", error);
      throw new Error(
        error.message || "Erreur lors de la création de l'annonce",
      );
    }
  });
