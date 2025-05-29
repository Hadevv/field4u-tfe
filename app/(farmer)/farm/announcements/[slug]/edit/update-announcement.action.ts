/* eslint-disable @typescript-eslint/no-unused-vars */
"use server";

import { ActionError, authAction } from "@/lib/backend/safe-actions";
import { isFarmer } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { uploadManager } from "@/features/upload/upload-new";
import { UpdateAnnouncementSchema } from "./update-announcement.schema";

export const updateAnnouncementAction = authAction
  .schema(UpdateAnnouncementSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    // vérifier le role
    try {
      await isFarmer();
    } catch (error) {
      throw new ActionError(
        "vous n'avez pas les droits pour modifier cette annonce",
      );
    }
    const user = ctx.user;

    try {
      // vérifier que l'annonce existe et appartient à l'utilisateur
      const announcement = await prisma.announcement.findUnique({
        where: { id: input.announcementId },
      });

      if (!announcement) {
        throw new ActionError("annonce non trouvée");
      }

      if (announcement.ownerId !== user.id) {
        throw new ActionError(
          "vous n'êtes pas autorisé à modifier cette annonce",
        );
      }

      // verifier que le champ appartient bien a lui
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
          "ce champ n'existe pas ou ne vous appartient pas",
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
          } catch (uploadError) {
            console.error("erreur lors de l'upload des images:", uploadError);
            throw new ActionError(
              uploadError instanceof Error
                ? uploadError.message
                : "erreur lors de l'upload des images",
            );
          }
        }
      }

      // mise à jour de l'annonce
      const updatedAnnouncement = await prisma.announcement.update({
        where: { id: input.announcementId },
        data: {
          title: input.title,
          description: input.description,
          fieldId: input.fieldId,
          cropTypeId: input.cropTypeId,
          quantityAvailable: input.quantityAvailable || null,
          images: imageUrls,
          startDate: input.startDate,
          endDate: input.endDate,
          suggestedPrice: input.suggestedPrice
            ? input.suggestedPrice.toString()
            : null,
        },
      });

      revalidatePath("/farm/announcements");
      revalidatePath(`/farm/announcements/${announcement.slug}`);

      return {
        success: true,
        announcementId: updatedAnnouncement.id,
        slug: updatedAnnouncement.slug,
      };
    } catch (error) {
      console.error("erreur lors de la mise à jour de l'annonce:", error);
      throw new ActionError(
        error instanceof Error
          ? error.message
          : "erreur lors de la mise à jour de l'annonce",
      );
    }
  });
