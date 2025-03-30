/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/prisma";
import { AnnouncementList } from "./_components/AnnouncementList";
import { AnnouncementMap } from "./_components/AnnouncementMap";
import { Announcement, MapAnnouncement } from "./_components/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, List } from "lucide-react";
import { SearchWizard } from "./_components/SearchWizard";
import { auth } from "@/lib/auth/helper";
import {
  addDays,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import type { PageParams } from "@/types/next";
import { Prisma } from "@prisma/client";
import { AnnouncementTabs } from "./_components/AnnouncementTabs";

export default async function AnnouncementsPage(props: PageParams) {
  // Récupérer les paramètres de recherche
  const searchParams = await props.searchParams;

  const query = typeof searchParams.q === "string" ? searchParams.q : "";
  const cropTypeId =
    typeof searchParams.crop === "string" ? searchParams.crop : undefined;
  const locationQuery =
    typeof searchParams.location === "string"
      ? searchParams.location
      : undefined;
  const radius = parseInt(
    typeof searchParams.radius === "string" ? searchParams.radius : "50",
  );
  const period =
    typeof searchParams.period === "string" ? searchParams.period : "all";
  const lat = parseFloat(
    typeof searchParams.lat === "string" ? searchParams.lat : "0",
  );
  const lng = parseFloat(
    typeof searchParams.lng === "string" ? searchParams.lng : "0",
  );
  const useCurrentLocation = searchParams.useCurrentLocation === "true";

  // Récupérer l'utilisateur connecté pour vérifier les likes et ses préférences
  const user = await auth();
  const userPreferences = user
    ? {
        city: user.city || undefined,
        postalCode: user.postalCode || undefined,
        acceptGeolocation: user.acceptGeolocation || false,
      }
    : undefined;

  // Construire la requête Prisma avec les filtres
  const where: Prisma.AnnouncementWhereInput = { isPublished: true };

  // Filtre par mot-clé (recherche dans le titre et la description)
  if (query) {
    where.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  // Filtre par type de culture
  if (cropTypeId) {
    where.cropTypeId = cropTypeId;
  }

  // Filtre par localisation
  if (locationQuery) {
    where.field = {
      OR: [
        { city: { contains: locationQuery, mode: "insensitive" } },
        { postalCode: { contains: locationQuery } },
      ],
    };
  }

  // Filtre par position géographique actuelle
  if (useCurrentLocation && lat && lng) {
    // Ici une recherche par distance serait idéale
    // Pour une implémentation complète, nous aurions besoin de PostGIS ou d'une fonction spatiale
    // Pour le moment, nous allons filtrer avec plusieurs conditions
    const latDelta = radius / 111; // Approximatif: 1 degré de latitude ~ 111 km
    const lngDelta = radius / (111 * Math.cos((lat * Math.PI) / 180)); // Ajuster pour la longitude

    const fieldCondition: Prisma.FieldWhereInput = {
      latitude: {
        gte: lat - latDelta,
        lte: lat + latDelta,
      },
      longitude: {
        gte: lng - lngDelta,
        lte: lng + lngDelta,
      },
    };

    where.field = where.field
      ? { ...where.field, ...fieldCondition }
      : fieldCondition;
  }

  // Filtre par période
  if (period && period !== "all") {
    const now = new Date();
    let startDate: Date;
    let endDate: Date;

    switch (period) {
      case "today":
        startDate = startOfDay(now);
        endDate = endOfDay(now);
        break;
      case "week":
        startDate = startOfWeek(now, { weekStartsOn: 1 });
        endDate = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case "month":
        startDate = startOfMonth(now);
        endDate = endOfMonth(now);
        break;
      default:
        startDate = now;
        endDate = addDays(now, 365);
    }

    where.gleaningPeriods = {
      some: {
        gleaningPeriod: {
          startDate: { lte: endDate },
          endDate: { gte: startDate },
        },
      },
    };
  }

  // Récupération des types de cultures pour les filtres
  const cropTypes = await prisma.cropType.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  // Récupération des annonces depuis la base de données
  const announcements = await prisma.announcement.findMany({
    where,
    select: {
      id: true,
      title: true,
      description: true,
      slug: true,
      images: true,
      isPublished: true,
      createdAt: true,
      cropType: {
        select: {
          id: true,
          name: true,
          category: true,
        },
      },
      field: {
        select: {
          id: true,
          city: true,
          postalCode: true,
          latitude: true,
          longitude: true,
        },
      },
      gleaningPeriods: {
        select: {
          gleaningPeriod: {
            select: {
              id: true,
              startDate: true,
              endDate: true,
              status: true,
            },
          },
        },
      },
      owner: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      likes: user
        ? {
            where: {
              userId: user.id,
            },
            select: {
              id: true,
            },
          }
        : undefined,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  // Transformation des données pour correspondre à notre type Announcement
  const formattedAnnouncements: Announcement[] = announcements.map(
    (announcement) => ({
      ...announcement,
      gleaningPeriods: announcement.gleaningPeriods.map((period) => ({
        id: period.gleaningPeriod.id,
        startDate: period.gleaningPeriod.startDate,
        endDate: period.gleaningPeriod.endDate,
        status: period.gleaningPeriod.status,
      })),
      isLiked:
        announcement.likes && announcement.likes.length > 0 ? true : false,
    }),
  );

  // Préparation des données pour la carte
  const mapAnnouncements: MapAnnouncement[] = formattedAnnouncements.map(
    (announcement) => ({
      id: announcement.id,
      title: announcement.title,
      latitude: announcement.field.latitude,
      longitude: announcement.field.longitude,
      slug: announcement.slug,
    }),
  );

  return (
    <div className="container mx-auto py-6 space-y-4">
      <h1 className="text-2xl font-bold">Explorer les annonces de glanage</h1>

      {/* Intégration du SearchWizard */}
      <SearchWizard cropTypes={cropTypes} userLocation={userPreferences} />

      {/* Vue Mobile: Onglets pour basculer entre carte et liste */}
      <div className="md:hidden">
        <AnnouncementTabs
          listContent={
            <AnnouncementList announcements={formattedAnnouncements} />
          }
          mapContent={<AnnouncementMap announcements={mapAnnouncements} />}
        />
      </div>

      {/* Vue Desktop: Affichage côte à côte */}
      <div className="hidden md:grid md:grid-cols-12 gap-6">
        <div className="md:col-span-4 lg:col-span-3">
          <AnnouncementList announcements={formattedAnnouncements} />
        </div>
        <div className="md:col-span-8 lg:col-span-9">
          <AnnouncementMap announcements={mapAnnouncements} />
        </div>
      </div>
    </div>
  );
}
