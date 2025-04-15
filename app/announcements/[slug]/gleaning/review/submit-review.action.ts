"use server";

import { authAction } from "@/lib/backend/safe-actions";
import { prisma } from "@/lib/prisma";
import { ReviewSchema } from "./submit-review.schema";
import { uploadManager } from "@/features/upload/upload-new";

export const submitReviewAction = authAction
  .schema(ReviewSchema)
  .action(async ({ parsedInput, ctx }) => {
    const {
      gleaningId,
      rating,
      content,
      images = [],
      imageFiles,
    } = parsedInput;
    const userId = ctx.user.id;

    // verifier si l'utilisateur a participé au glanage
    const participation = await prisma.participation.findUnique({
      where: {
        userId_gleaningId: {
          userId,
          gleaningId,
        },
      },
    });

    if (!participation) {
      throw new Error("vous n'avez pas participé à ce glanage");
    }

    // verifier si l'utilisateur a deja laisse un avis
    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        gleaningId,
      },
    });

    if (existingReview) {
      throw new Error("vous avez déjà laissé un avis pour ce glanage");
    }

    // gerer les images uploadées
    let imageUrls: string[] = images || [];

    // si nous avons des fichiers d'images à traiter via FormData
    if (imageFiles) {
      const files = imageFiles.getAll("files") as File[];

      if (files.length > 0) {
        try {
          // utiliser le gestionnaire d'upload pour télécharger les fichiers
          const uploadedUrls = await uploadManager.uploadFiles(files, {
            maxSizeMB: 2,
          });
          imageUrls = [...imageUrls, ...uploadedUrls];
        } catch (error) {
          console.error("erreur lors de l'upload des images:", error);
          throw new Error(
            error instanceof Error
              ? error.message
              : "erreur lors de l'upload des images",
          );
        }
      }
    }

    // creer l'avis
    const review = await prisma.review.create({
      data: {
        userId,
        gleaningId,
        rating,
        content,
        images: imageUrls,
      },
    });

    return review;
  });
