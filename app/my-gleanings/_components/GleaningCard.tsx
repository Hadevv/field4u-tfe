import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Leaf, Star, ArrowRight } from "lucide-react";
import { getGleaningStatusInfo } from "../../announcements/_components/types";
import type { GleaningStatus } from "@prisma/client";

type GleaningCardProps = {
  announcement: {
    id: string;
    title: string;
    slug: string;
    startDate?: Date | null;
    endDate?: Date | null;
    images?: string[];
    field: {
      city: string;
    };
    cropType: {
      name: string;
    };
  };
  gleaningStatus: GleaningStatus | null;
  createdAt: Date;
  hasReviewed?: boolean;
  gleaningId?: string;
  type: "participation" | "favorite" | "like" | "review";
};

export function GleaningCard({
  announcement,
  gleaningStatus,
  createdAt,
  hasReviewed,
  gleaningId,
  type,
}: GleaningCardProps) {
  const statusInfo = getGleaningStatusInfo(
    announcement.startDate ?? undefined,
    announcement.endDate ?? undefined,
    gleaningStatus ?? undefined,
  );

  const isCompletedGleaning =
    gleaningStatus === "COMPLETED" && type === "participation" && !hasReviewed;

  return (
    <div className="border rounded-lg overflow-hidden transition-all hover:shadow-md">
      <div className="flex w-full">
        {/* image */}
        <div className="relative w-48 h-32 flex-shrink-0">
          {announcement.images && announcement.images.length > 0 ? (
            <Image
              src={announcement.images[0]}
              alt={announcement.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <Leaf className="h-8 w-8 text-muted-foreground/40" />
            </div>
          )}
        </div>

        {/* contenu */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex justify-between items-start mb-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-base truncate">
                {announcement.title}
              </h3>
              {statusInfo && (
                <Badge
                  variant="outline"
                  className={`${statusInfo.color} text-xs px-2 py-0 h-5`}
                >
                  {statusInfo.label}
                </Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              {type === "participation" && "participation "}
              {type === "favorite" && "ajouté aux favoris "}
              {type === "like" && "aimé "}
              {type === "review" && "évalué "}
              le{" "}
              {new Date(createdAt).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>

          <div className="flex items-center text-sm text-muted-foreground mb-2">
            <div className="flex items-center gap-2">
              <Leaf className="w-3.5 h-3.5" />
              <span>{announcement.cropType.name}</span>
            </div>
            <span className="mx-2">•</span>
            <div className="flex items-center gap-1">
              <span>{announcement.field.city}</span>
            </div>
            <span className="mx-2">•</span>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {announcement.startDate
                  ? new Date(announcement.startDate).toLocaleDateString(
                      "fr-FR",
                      {
                        day: "numeric",
                        month: "short",
                      },
                    )
                  : "date non définie"}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-auto pt-2">
            <Button asChild variant="outline" size="sm">
              <Link href={`/announcements/${announcement.slug}`}>
                voir l'annonce
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>

            {isCompletedGleaning && (
              <Button asChild size="sm" variant="default" className="gap-1">
                <Link
                  href={`/announcements/${announcement.slug}/gleaning/review`}
                  className="flex items-center"
                >
                  <Star className="w-3.5 h-3.5" />
                  donner mon avis
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
