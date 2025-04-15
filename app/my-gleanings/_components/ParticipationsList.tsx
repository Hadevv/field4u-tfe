import { prisma } from "@/lib/prisma";
import { GleaningCard } from "./GleaningCard";
import { EmptyState } from "./EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star } from "lucide-react";

async function getParticipations(userId: string) {
  const participations = await prisma.participation.findMany({
    where: {
      userId,
    },
    include: {
      gleaning: {
        include: {
          announcement: {
            include: {
              field: true,
              cropType: true,
              owner: true,
            },
          },
          reviews: {
            where: {
              userId,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return participations;
}

export async function ParticipationsList({ userId }: { userId: string }) {
  const participations = await getParticipations(userId);

  if (participations.length === 0) {
    return (
      <EmptyState
        title="pas encore de participations"
        description="rejoignez des glanages pour les voir apparaître ici"
        icon="participate"
      />
    );
  }

  // filtrer les glanages terminés sans évaluation pour les mettre en avant
  const pendingReviews = participations.filter(
    (p) => p.gleaning.status === "COMPLETED" && p.gleaning.reviews.length === 0,
  );

  return (
    <div className="space-y-6">
      {/* Section des évaluations en attente */}
      {pendingReviews.length > 0 && (
        <div className="bg-primary/10 p-4 rounded-lg mb-6">
          <h3 className="text-sm font-medium mb-3">évaluations en attente</h3>
          <div className="space-y-3">
            {pendingReviews.map((participation) => {
              const gleaning = participation.gleaning;
              const announcement = gleaning.announcement;

              return (
                <div
                  key={participation.id}
                  className="flex justify-between items-center bg-background p-3 rounded-md"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{announcement.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {announcement.field.city}
                    </p>
                  </div>
                  <Button asChild size="sm" variant="default" className="gap-1">
                    <Link
                      href={`/announcements/${announcement.slug}/gleaning/review`}
                      className="flex items-center"
                    >
                      <Star className="w-3.5 h-3.5" />
                      évaluer
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Liste de toutes les participations */}
      <div className="space-y-4">
        {participations.map((participation) => {
          const gleaning = participation.gleaning;
          const announcement = gleaning.announcement;
          const hasReviewed = gleaning.reviews.length > 0;

          return (
            <GleaningCard
              key={participation.id}
              announcement={announcement}
              gleaningStatus={gleaning.status}
              createdAt={participation.createdAt}
              hasReviewed={hasReviewed}
              gleaningId={gleaning.id}
              type="participation"
            />
          );
        })}
      </div>
    </div>
  );
}
