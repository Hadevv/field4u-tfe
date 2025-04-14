"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { Announcement, getGleaningStatusInfo } from "./types";
import { LikeButton } from "./LikeButton";
import { formatDate } from "@/lib/format/date";

type AnnouncementCardProps = {
  announcement: Announcement;
  isLiked?: boolean;
};

export function AnnouncementCard({
  announcement,
  isLiked = false,
}: AnnouncementCardProps) {
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
  } = announcement;

  // utiliser la première image ou une image par défaut
  const imageUrl =
    images && images.length > 0 ? images[0] : "/images/harvest-potatoes.avif";

  // utiliser la fonction centralisée pour obtenir les infos de statut
  const statusInfo = getGleaningStatusInfo(startDate, endDate);

  // extraire la quantité et l'unité de la description
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

  const quantityText = getQuantityAndType();

  return (
    <Link href={`/announcements/${slug}`} prefetch={false} className="block">
      <Card className="overflow-hidden bg-white hover:shadow transition-shadow rounded-lg mb-4">
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
                <Badge variant="outline" className="bg-muted shadow-sm">
                  {statusInfo.label}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex-1 p-4 relative">
            {/* bouton like */}
            <div className="absolute top-3 right-3">
              <LikeButton announcementId={id} initialLiked={isLiked} />
            </div>
            {/* titre et organisme */}
            <div className="mb-3 pr-10">
              <div className="text-muted-foreground text-sm mb-1">
                Ferme des Champs Libres
              </div>
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
    </Link>
  );
}
