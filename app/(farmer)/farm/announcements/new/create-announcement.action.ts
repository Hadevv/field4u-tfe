/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { ActionError, authAction } from "@/lib/backend/safe-actions";
import { isFarmer } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { AnnouncementSchema } from "./announcement.schema";
import { nanoid } from "nanoid";
import { generateSlug } from "@/lib/format/id";
import { uploadManager } from "@/features/upload/upload-new";

export const createAnnouncementAction = authAction
  .schema(AnnouncementSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    // vérifier que l'utilisateur est bien un agriculteur
    try {
      await isFarmer();
    } catch (error) {
      throw new ActionError(
        "Vous n'avez pas les droits pour créer une annonce",
      );
    }
    const user = ctx.user;

    try {
      // verifier que le champ appartient bien à l'agriculteur
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
        throw new ActionError(
          "Ce champ n'existe pas ou ne vous appartient pas",
        );
      }

      let imageUrls: string[] = input.images || [];

      if (input.imageFiles) {
        const files = input.imageFiles.getAll("files") as File[];

        if (files.length > 0) {
          try {
            const uploadedUrls = await uploadManager.uploadFiles(files, {
              maxSizeMB: 2,
            });
            imageUrls = [...imageUrls, ...uploadedUrls];
          } catch (error) {
            console.error("Erreur lors de l'upload des images:", error);
            throw new ActionError(
              error instanceof Error
                ? error.message
                : "Erreur lors de l'upload des images",
            );
          }
        }
      }

      // creation de l'annonce avec startDate et endDate directement
      const announcement = await prisma.announcement.create({
        data: {
          title: input.title,
          description: input.description,
          fieldId: input.fieldId,
          cropTypeId: input.cropTypeId,
          quantityAvailable: input.quantityAvailable || null,
          slug: generateSlug(input.title),
          ownerId: user.id,
          isPublished: true,
          images: imageUrls,
          startDate: input.startDate,
          endDate: input.endDate,
        },
      });

      // crer un glanage associé à l'annonce
      await prisma.gleaning.create({
        data: {
          announcementId: announcement.id,
          status: "NOT_STARTED",
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
      throw new ActionError(
        error.message || "Erreur lors de la création de l'annonce",
      );
    }
  });
