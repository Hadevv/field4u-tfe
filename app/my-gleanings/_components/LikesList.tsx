import { prisma } from "@/lib/prisma";
import { GleaningCard } from "./GleaningCard";
import { EmptyState } from "./EmptyState";

async function getLikes(userId: string) {
  const likes = await prisma.like.findMany({
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

  return likes;
}

export async function LikesList({ userId }: { userId: string }) {
  const likes = await getLikes(userId);

  if (likes.length === 0) {
    return (
      <EmptyState
        title="pas encore de j'aime"
        description="aimez des annonces pour les retrouver ici"
        icon="like"
      />
    );
  }

  return (
    <div className="space-y-4">
      {likes.map((like) => {
        const announcement = like.announcement;
        const gleaningStatus = announcement.gleaning?.status || null;

        return (
          <GleaningCard
            key={like.id}
            announcement={announcement}
            gleaningStatus={gleaningStatus}
            createdAt={like.createdAt}
            type="like"
          />
        );
      })}
    </div>
  );
}
