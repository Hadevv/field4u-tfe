"use server";

import { prisma } from "@/lib/prisma";
import { authAction } from "@/lib/backend/safe-actions";
import { LikeAnnouncementSchema } from "./like.schema";

export const toggleLikeAction = authAction
  .schema(LikeAnnouncementSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { announcementId } = parsedInput;
    const userId = ctx.user.id;
    if (!userId) {
      throw new Error("Unauthorized");
    }

    // vérifier si l'utilisateur a déjà liké cette annonce
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        announcementId,
      },
    });

    // si l'utilisateur a déjà liké l'annonce, supprimer le like (unlike)
    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return { liked: false };
    }

    // Sinon, créer un nouveau like
    await prisma.like.create({
      data: {
        userId,
        announcementId,
      },
    });

    return { liked: true };
  });
