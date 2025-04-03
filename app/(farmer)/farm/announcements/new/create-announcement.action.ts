"use server";

import { z } from "zod";
import { authAction } from "@/lib/backend/safe-actions";
import { isFarmer } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { dialogManager } from "@/features/dialog-manager/dialog-manager-store";

const CreateAnnouncementSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  description: z
    .string()
    .min(20, "La description doit contenir au moins 20 caractères"),
  fieldId: z.string().min(1, "Veuillez sélectionner un champ"),
  cropTypeId: z.string().min(1, "Veuillez sélectionner un type de culture"),
  quantityAvailable: z
    .number()
    .min(1, "La quantité doit être supérieure à 0")
    .optional(),
  gleaningPeriods: z
    .array(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .min(1, "Veuillez ajouter au moins une période de glanage"),
  images: z.array(z.string()).optional(),
});

export const createAnnouncementAction = authAction
  .schema(CreateAnnouncementSchema)
  .action(async ({ parsedInput, ctx }) => {
    // Vérifier que l'utilisateur est bien un agriculteur
    try {
      await isFarmer();
    } catch (error) {
      throw new Error("Vous n'avez pas les droits pour créer une annonce");
    }

    const user = ctx.session.user;

    try {
      // Vérifier que le champ appartient bien à l'agriculteur
      const field = await prisma.field.findFirst({
        where: {
          id: parsedInput.fieldId,
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

      // Créer l'annonce
      const announcement = await prisma.announcement.create({
        data: {
          title: parsedInput.title,
          description: parsedInput.description,
          fieldId: parsedInput.fieldId,
          cropTypeId: parsedInput.cropTypeId,
          quantityAvailable: parsedInput.quantityAvailable,
          ownerId: user.id,
          images: parsedInput.images || [],
        },
      });

      // Créer les périodes de glanage
      for (const period of parsedInput.gleaningPeriods) {
        // Créer la période de glanage
        const gleaningPeriod = await prisma.gleaningPeriod.create({
          data: {
            startDate: period.startDate,
            endDate: period.endDate,
            status: "AVAILABLE",
          },
        });

        // Lier la période à l'annonce
        await prisma.announcementGleaningPeriod.create({
          data: {
            announcementId: announcement.id,
            gleaningPeriodId: gleaningPeriod.id,
          },
        });
      }

      // Créer un glanage associé à l'annonce (pour les participations)
      await prisma.gleaning.create({
        data: {
          announcementId: announcement.id,
          status: "PENDING",
        },
      });

      // Mettre à jour les statistiques de l'agriculteur
      await prisma.statistic.upsert({
        where: { userId: user.id },
        update: {
          totalAnnouncements: { increment: 1 },
        },
        create: {
          userId: user.id,
          totalAnnouncements: 1,
        },
      });

      // Rafraîchir la page des annonces
      revalidatePath("/farm/announcements");

      return { success: true, announcementId: announcement.id };
    } catch (error: any) {
      console.error("Erreur lors de la création de l'annonce:", error);
      throw new Error(
        error.message || "Erreur lors de la création de l'annonce",
      );
    }
  });
