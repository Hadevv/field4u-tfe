import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { PageParams } from "@/types/next";
import { Metadata } from "next";
import Link from "next/link";
import {
  Calendar,
  Leaf,
  MapPin,
  MessageSquare,
  Package,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/helper";
import { JoinGleaningButton } from "./gleaning/_components/JoinGleaningButton";
import { getGleaningStatusInfo } from "@/lib/format/gleaningStatus";
import { isFutureDate, getCurrentDate } from "@/lib/format/date";
import { Suspense } from "react";
import { LikeButton } from "../_components/LikeButton";
import { FavoriteButton } from "../_components/FavoriteButton";
import { Badge } from "@/components/ui/badge";
import { ShareButton } from "../_components/ShareButton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { AddToCalendarButton } from "@/features/calendar/AddToCalendarButton";

const formatDate = (date: Date) => {
  if (!date) return "";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
};

const calculateTimeRemaining = (date: Date) => {
  if (!date) return "";
  const now = getCurrentDate();
  const diff = date.getTime() - now.getTime();

  // convertir la différence en jours et heures
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return `${days}j ${hours}h`;
  }
  return `${hours}h`;
};

export async function generateMetadata(
  props: PageParams<{ slug: string }>,
): Promise<Metadata> {
  const params = await props.params;

  const announcement = await prisma.announcement.findUnique({
    where: { slug: params.slug },
    select: { title: true },
  });

  if (!announcement) {
    return {
      title: "annonce non trouvée | field4u",
    };
  }

  return {
    title: `${announcement.title} | field4u`,
    description: "détails de l'annonce et inscription au glanage",
  };
}

async function getAnnouncementData(slug: string, userId?: string) {
  const announcement = await prisma.announcement.findUnique({
    where: { slug },
    include: {
      cropType: true,
      field: {
        select: {
          city: true,
          postalCode: true,
        },
      },
      owner: true,
      likes: userId
        ? {
            where: { userId },
          }
        : false,
      favorites: userId
        ? {
            where: { userId },
          }
        : false,
      gleaning: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  if (!announcement) {
    notFound();
  }

  // vérifier si l'utilisateur participe déjà au glanage
  let userIsParticipant = false;

  if (userId && announcement.gleaning) {
    const participation = await prisma.participation.findUnique({
      where: {
        userId_gleaningId: {
          userId,
          gleaningId: announcement.gleaning.id,
        },
      },
    });

    userIsParticipant = !!participation;
  }

  return {
    ...announcement,
    userIsParticipant,
    likeCount: announcement._count.likes,
  };
}

export default async function AnnouncementPage(
  props: PageParams<{ slug: string }>,
) {
  const params = await props.params;
  const user = await auth();

  return (
    <div className="container mx-auto pt-4 px-4 pb-16">
      <div className="flex flex-col gap-6 shadow-sm border rounded-lg p-4 sm:p-6">
        <div className="w-full">
          <AnnouncementContent slug={params.slug} userId={user?.id} />
        </div>
      </div>
    </div>
  );
}

async function AnnouncementContent({
  slug,
  userId,
}: {
  slug: string;
  userId?: string;
}) {
  const announcement = await getAnnouncementData(slug, userId);

  const statusInfo = getGleaningStatusInfo(
    announcement.startDate,
    announcement.endDate,
    announcement.gleaning ? announcement.gleaning.status : undefined,
  );

  const hasMultipleImages =
    announcement.images && announcement.images.length > 1;

  return (
    <div className="rounded-lg p-4 sm:p-6 shadow-sm">
      {/* statut de l'annonce */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
        <div className="flex items-center">
          <Badge
            variant="outline"
            className={`${statusInfo.color} mr-2 px-3 py-1`}
          >
            {statusInfo.label}
          </Badge>
        </div>

        {announcement.startDate && announcement.endDate && (
          <div className="text-xs text-muted-foreground flex flex-wrap items-center">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>
              {isFutureDate(announcement.startDate)
                ? `début dans ${calculateTimeRemaining(announcement.startDate)}`
                : isFutureDate(announcement.endDate)
                  ? "glanage en cours"
                  : "glanage terminé"}
            </span>
            {isFutureDate(announcement.endDate) && (
              <div className="ml-0 sm:ml-4 flex items-center text-muted-foreground mt-1 sm:mt-0 w-full sm:w-auto">
                <div className="w-3 h-3 bg-muted rounded-full mr-1"></div>
                {isFutureDate(announcement.endDate) &&
                  `fin dans ${calculateTimeRemaining(announcement.endDate)}`}
              </div>
            )}
          </div>
        )}
      </div>

      {/* section principale */}
      <div className="flex flex-col sm:flex-row sm:justify-between mb-2 gap-1">
        <div>
          <p className="text-sm mb-1 text-muted-foreground">
            explorez. partagez. récoltez.
          </p>
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-foreground">
              {announcement.title}
            </h1>
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground font-medium sm:text-right">
            {announcement.owner.name}
          </p>
        </div>
      </div>

      {/* description et images - version mobile d'abord */}
      <div className="flex flex-col md:flex-row mt-4 md:mt-6 gap-4 md:gap-8">
        {/* image section en premier sur mobile */}
        <div className="w-full md:w-1/2 md:order-2 relative mb-4 md:mb-0">
          {hasMultipleImages ? (
            <Carousel className="w-full">
              <CarouselContent>
                {announcement.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[220px] sm:h-[280px] md:h-[320px] rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`${announcement.title} - image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-background border-none shadow-sm" />
              <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-background border-none shadow-sm" />
            </Carousel>
          ) : (
            <div className="relative h-[220px] sm:h-[280px] md:h-[320px] rounded-lg overflow-hidden">
              {announcement.images && announcement.images.length > 0 ? (
                <Image
                  src={announcement.images[0]}
                  alt={announcement.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Leaf className="w-12 h-12 text-muted-foreground/40" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* description et infos */}
        <div className="w-full md:w-1/2 md:order-1">
          <p className="text-muted-foreground mb-6">
            {announcement.description}
          </p>

          {/* information section */}
          <div className="mt-4 md:mt-8">
            <h3 className="text-lg md:text-xl font-semibold mb-4">
              informations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 sm:gap-y-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mr-3">
                  <Leaf className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm">{announcement.cropType.name}</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mr-3">
                  <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm">
                  {announcement.quantityAvailable
                    ? `${announcement.quantityAvailable} tonnes à glaner`
                    : "quantité non spécifiée"}
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mr-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm">
                  {announcement.startDate && formatDate(announcement.startDate)}
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mr-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm">
                  {announcement.field.postalCode} - {announcement.field.city}
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mr-3">
                  <Package className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-sm">bio pas de pesticide</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* action buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full mt-6 gap-4">
        <div className="w-full sm:w-auto">
          <Suspense
            fallback={
              <Button disabled className="w-full sm:w-auto">
                chargement...
              </Button>
            }
          >
            <JoinGleaningButton
              announcementId={announcement.id}
              slug={slug}
              userIsParticipant={announcement.userIsParticipant}
              className="w-full sm:w-auto"
            />
          </Suspense>
        </div>

        <div className="flex flex-wrap justify-center sm:justify-end gap-3 w-full sm:w-auto ">
          <LikeButton
            announcementId={announcement.id}
            initialLiked={announcement.likes?.length > 0}
            likeCount={announcement.likeCount}
          />

          <FavoriteButton
            announcementId={announcement.id}
            initialFavorited={announcement.favorites?.length > 0}
          />

          <ShareButton title={announcement.title} slug={slug} />

          {announcement.startDate && announcement.endDate && (
            <AddToCalendarButton
              title={announcement.title}
              description={announcement.description}
              startDate={announcement.startDate}
              endDate={announcement.endDate}
              location={`${announcement.field.postalCode} - ${announcement.field.city}`}
            />
          )}
        </div>

        <div className="w-full sm:w-auto mt-2 sm:mt-0">
          <Button asChild className="w-full sm:w-auto" variant="secondary">
            <Link href={`/messages/user/${announcement.owner.id}`}>
              <MessageSquare className="size-4 mr-2" />
              contacter
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
