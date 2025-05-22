"use server";

import { prisma } from "@/lib/prisma";
import { authAction } from "@/lib/backend/safe-actions";
import { LikeAnnouncementSchema } from "./like.schema";
import { revalidatePath } from "next/cache";

export const toggleLikeAction = authAction
  .schema(LikeAnnouncementSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { announcementId } = parsedInput;

    const userId = ctx.user.id;

    // verifier si l'utilisateur a déjà liké cette annonce
    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        announcementId,
      },
    });

    // si deja liké, supprimer le like
    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });

      // rafraîchir les pages concernées
      revalidatePath(`/announcements`);
      revalidatePath(`/announcements/[slug]`, "page");
      revalidatePath(`/my-gleanings`);

      return { liked: false };
    }

    // sinon, créer un nouveau like
    await prisma.like.create({
      data: {
        userId,
        announcementId,
      },
    });

    // rafraîchir les pages concernées
    revalidatePath(`/announcements`);
    revalidatePath(`/announcements/[slug]`, "page");
    revalidatePath(`/my-gleanings`);

    return { liked: true };
  });
