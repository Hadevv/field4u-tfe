"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Calendar, MapPin, Navigation } from "lucide-react";
import { getGleaningStatusInfo } from "@/lib/format/gleaningStatus";
import { Announcement } from "@/types/announcement";
import { LikeButton } from "./LikeButton";
import { formatDate } from "@/lib/format/date";
import { useRouter } from "next/navigation";

type AnnouncementCardProps = {
  announcement: Announcement;
  isLiked?: boolean;
  onZoomToLocation?: (announcementId: string) => void;
};

export function AnnouncementCard({
  announcement,
  isLiked = false,
  onZoomToLocation,
}: AnnouncementCardProps) {
  const router = useRouter();

  const {
    title,
    description,
    slug,
    images,
    cropType,
    field,
    id,
    startDate,
    endDate,
    status,
    owner,
    likeCount,
  } = announcement;

  const imageUrl =
    images && images.length > 0 ? images[0] : "/images/harvest-potatoes.avif";

  // obtenir les info de statut
  const statusInfo = status
    ? getGleaningStatusInfo(startDate, endDate, status)
    : getGleaningStatusInfo(startDate, endDate);

  // extraire la quantite
  const getQuantityAndType = () => {
    const regex = /(\d+)\s*(kg|g|t|L)\s*de\s*([^\s,.]+)/i;
    const match = description.match(regex);

    if (match) {
      const quantity = match[1];
      const unit = match[2].toLowerCase();
      return `${quantity} ${unit} de ${cropType.name}`;
    }

    return null;
  };

  const handleCardClick = () => {
    router.push(`/announcements/${slug}`);
  };

  const handleZoomClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onZoomToLocation) {
      onZoomToLocation(id);
    }
  };

  const quantityText = getQuantityAndType();
  return (
    <Card
      className="overflow-hidden rounded-lg mb-4 cursor-pointer transition-all hover:shadow-md"
      onClick={handleCardClick}
    >
      <div className="flex">
        {/* image à gauche */}
        <div className="relative w-[120px] min-w-[150px]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="180px"
            className="object-cover"
            loading="lazy"
          />

          {/* type de culture et statut */}
          <div className="absolute left-3 bottom-3 flex items-center gap-2 flex-col">
            <Badge variant="secondary" className="shadow-sm">
              {cropType.name}
            </Badge>
            {statusInfo.label && (
              <Badge
                variant="default"
                className={`${statusInfo.color} shadow-sm`}
              >
                {statusInfo.label}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex-1 p-4 relative">
          {/* bouton like et compteur */}
          <div
            className="absolute top-3 right-3 flex items-center gap-2"
            onClick={(e) => e.stopPropagation()}
          >
            {onZoomToLocation && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleZoomClick}
                className="h-8 w-8 p-0"
                title="Localiser sur la carte"
              >
                <Navigation className="h-4 w-4" />
              </Button>
            )}
            <LikeButton
              announcementId={id}
              initialLiked={isLiked}
              likeCount={likeCount}
            />
          </div>
          {/* titre et organisme */}
          <div className="mb-3 pr-20">
            {owner && owner.name && (
              <div className="text-muted-foreground text-sm mb-1">
                {owner.name}
              </div>
            )}
            <h3 className="font-semibold text-base line-clamp-1">{title}</h3>
          </div>

          {/* description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {quantityText || description}
          </p>

          {/* localisation et dates */}
          <div className="space-y-1.5 mt-auto">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
              <span className="truncate">
                {field.city}, {field.postalCode}
              </span>
            </div>

            {startDate && endDate && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5 flex-shrink-0 text-muted-foreground" />
                <span>
                  {formatDate(startDate)} - {formatDate(endDate)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
