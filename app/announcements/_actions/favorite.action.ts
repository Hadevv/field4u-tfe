"use server";

import { prisma } from "@/lib/prisma";
import { authAction } from "@/lib/backend/safe-actions";
import { FavoriteAnnouncementSchema } from "./favorite.schema";
import { revalidatePath } from "next/cache";

export const toggleFavoriteAction = authAction
  .schema(FavoriteAnnouncementSchema)
  .action(async ({ parsedInput, ctx }) => {
    const { announcementId } = parsedInput;
    const userId = ctx.user.id;

    // vérifier si l'utilisateur a déjà ajouté cette annonce en favoris
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId,
        announcementId,
      },
    });

    // si deja favoris, supprimer le favori
    if (existingFavorite) {
      await prisma.favorite.delete({
        where: {
          id: existingFavorite.id,
        },
      });

      // rafraîchir les pages concernées
      revalidatePath(`/announcements`);
      revalidatePath(`/announcements/[slug]`, "page");
      revalidatePath(`/my-gleanings`);

      return { favorited: false };
    }

    // sinon, créer un nouveau favori
    await prisma.favorite.create({
      data: {
        userId,
        announcementId,
      },
    });

    // rafraîchir les pages concernées
    revalidatePath(`/announcements`);
    revalidatePath(`/announcements/[slug]`, "page");
    revalidatePath(`/my-gleanings`);

    return { favorited: true };
  });
