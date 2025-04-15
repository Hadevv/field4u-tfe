import { prisma } from "@/lib/prisma";
import { GleaningCard } from "./GleaningCard";
import { EmptyState } from "./EmptyState";

async function getFavorites(userId: string) {
  const favorites = await prisma.favorite.findMany({
    where: {
      userId,
    },
    include: {
      announcement: {
        include: {
          field: true,
          cropType: true,
          owner: true,
          gleaning: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return favorites;
}

export async function FavoritesList({ userId }: { userId: string }) {
  const favorites = await getFavorites(userId);

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="pas encore de favoris"
        description="ajoutez des annonces à vos favoris pour les retrouver facilement ici"
        icon="favorite"
      />
    );
  }

  return (
    <div className="space-y-4">
      {favorites.map((favorite) => {
        const announcement = favorite.announcement;
        const gleaningStatus = announcement.gleaning?.status || null;

        return (
          <GleaningCard
            key={favorite.id}
            announcement={announcement}
            gleaningStatus={gleaningStatus}
            createdAt={favorite.createdAt}
            type="favorite"
          />
        );
      })}
    </div>
  );
}
