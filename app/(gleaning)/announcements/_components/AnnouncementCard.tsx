"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Calendar, CalendarDays, MapPin, User } from "lucide-react";
import { Announcement } from "./types";
import { LikeButton } from "./LikeButton";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AnnouncementCardProps {
  announcement: Announcement;
  isLiked?: boolean;
}

export function AnnouncementCard({
  announcement,
  isLiked = false,
}: AnnouncementCardProps) {
  const {
    id,
    title,
    description,
    slug,
    images,
    cropType,
    field,
    gleaningPeriods,
    owner,
  } = announcement;

  // utiliser la première image ou une image par défaut
  const imageUrl =
    images && images.length > 0 ? images[0] : "/images/harvest-potatoes.avif";

  // obtenir la période de glanage (première période si plusieurs)
  const gleaningPeriod =
    gleaningPeriods && gleaningPeriods.length > 0 ? gleaningPeriods[0] : null;

  // formatage des dates
  const formatDate = (date: Date) => {
    return format(new Date(date), "d MMM", { locale: fr });
  };

  const ownerName = owner.name || "Agriculteur";
  const ownerInitials = ownerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Déterminer le statut de la période pour afficher la bonne couleur
  const getPeriodStatusColors = () => {
    if (!gleaningPeriod) return { bg: "bg-gray-200", text: "text-gray-700" };

    const now = new Date();
    const startDate = new Date(gleaningPeriod.startDate);
    const endDate = new Date(gleaningPeriod.endDate);

    if (now < startDate) {
      return { bg: "bg-amber-100", text: "text-amber-700" }; // À venir
    } else if (now > endDate) {
      return { bg: "bg-red-100", text: "text-red-700" }; // Terminé
    } else {
      return { bg: "bg-green-100", text: "text-green-700" }; // En cours
    }
  };

  const periodColors = getPeriodStatusColors();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-200 h-full flex flex-col">
      <div className="relative overflow-hidden group">
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 300px"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end">
            <Badge
              className="bg-white text-primary hover:bg-white/90 border-none shadow-sm"
              variant="outline"
            >
              {cropType.name}
            </Badge>
            <div className="absolute top-3 right-3">
              <LikeButton announcementId={id} initialLiked={isLiked} />
            </div>
          </div>
        </div>
      </div>

      <CardHeader className="pb-0 pt-4 px-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-lg font-bold line-clamp-1 text-gray-900">
            {title}
          </h3>
          <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
            <AvatarImage src={owner.image || undefined} alt={ownerName} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {ownerInitials}
            </AvatarFallback>
          </Avatar>
        </div>
      </CardHeader>

      <CardContent className="flex-grow px-4 py-2">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0 text-primary" />
          <span className="truncate">
            {field.city}, {field.postalCode}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{description}</p>

        {gleaningPeriod && (
          <div
            className={cn(
              "flex items-center text-xs rounded-full px-2 py-0.5 w-fit",
              periodColors.bg,
              periodColors.text,
            )}
          >
            <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
            <span>
              {formatDate(gleaningPeriod.startDate)} -{" "}
              {formatDate(gleaningPeriod.endDate)}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 pb-4 px-4">
        <Button
          asChild
          variant="outline"
          className="w-full hover:bg-primary hover:text-primary-foreground border-primary/30 text-primary"
        >
          <Link href={`/announcements/${slug}`}>Voir les détails</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
