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
import { Metadata } from "next";
import { SearchFilters, PeriodFilter } from "./_components/types";
import {
  buildSearchQuery,
  buildPeriodQuery,
} from "./_queries/announcement.query";

export const metadata: Metadata = {
  title: "Annonces de glanage | Field4U",
  description:
    "Parcourez les annonces de glanage disponibles et rejoignez une session de glanage près de chez vous.",
};

export default async function AnnouncementsPage(props: PageParams) {
  // Récupérer les paramètres de recherche
  const searchParams = await props.searchParams;

  // Construire l'objet de filtres
  const filters: SearchFilters = {
    query: typeof searchParams.q === "string" ? searchParams.q : null,
    cropTypeId:
      typeof searchParams.crop === "string" ? searchParams.crop : null,
    location:
      typeof searchParams.location === "string" ? searchParams.location : null,
    radius:
      typeof searchParams.radius === "string" ? searchParams.radius : "25",
    period: (typeof searchParams.period === "string"
      ? searchParams.period
      : null) as PeriodFilter,
  };

  // Récupérer l'utilisateur connecté pour vérifier les likes
  const user = await auth();

  // Construire la requête Prisma avec les filtres
  const baseQuery = buildSearchQuery(filters);
  const periodQuery = buildPeriodQuery(filters.period || null);

  const where: Prisma.AnnouncementWhereInput = {
    ...baseQuery,
    ...periodQuery,
  };

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

  // Récupération des annonces depuis la base de données avec les filtres appliqués
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

  // transformation des données pour correspondre à notre type Announcement
  const formattedAnnouncements: Announcement[] = announcements.map(
    (announcement) => ({
      ...announcement,
      gleaningPeriods: announcement.gleaningPeriods.map((period) => ({
        id: period.gleaningPeriod.id,
        startDate: period.gleaningPeriod.startDate,
        endDate: period.gleaningPeriod.endDate,
        status: period.gleaningPeriod.status,
      })),
      isLiked: announcement.likes && announcement.likes.length > 0,
    }),
  );

  // préparation des données pour la carte
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
      {/* Intégration du SearchWizard avec les filtres initiaux */}
      <SearchWizard cropTypes={cropTypes} initialFilters={filters} />

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
