import { prisma } from "@/lib/prisma";
import { AnnouncementList } from "./_components/AnnouncementList";
import { AnnouncementMap } from "./_components/AnnouncementMap";
import { Announcement, MapAnnouncement } from "./_components/types";
import { SearchWizard } from "./_components/SearchWizard";
import { auth } from "@/lib/auth/helper";
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
  const searchParams = await props.searchParams;
  const user = await auth();
  const currentDate = new Date();

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

  const baseQuery = buildSearchQuery(filters);
  const periodQuery = buildPeriodQuery(filters.period || null);

  let combinedQuery: Prisma.AnnouncementWhereInput;

  if (periodQuery.gleaningPeriods) {
    combinedQuery = {
      ...baseQuery,
      ...periodQuery,
    };
  } else {
    combinedQuery = {
      ...baseQuery,
      gleaningPeriods: {
        some: {
          gleaningPeriod: {
            endDate: {
              gte: currentDate,
            },
          },
        },
      },
    };
  }

  const [cropTypes, announcements] = await Promise.all([
    prisma.cropType.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.announcement.findMany({
      where: combinedQuery,
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
    }),
  ]);

  const upcomingAnnouncements = announcements.filter((announcement) => {
    return announcement.gleaningPeriods.some((period) => {
      return period.gleaningPeriod.endDate > currentDate;
    });
  });

  const formattedAnnouncements: Announcement[] = upcomingAnnouncements.map(
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

  const sortedAnnouncements = [...formattedAnnouncements].sort((a, b) => {
    const aFuturePeriods = a.gleaningPeriods.filter(
      (period) =>
        period.startDate >= currentDate || period.endDate >= currentDate,
    );

    const bFuturePeriods = b.gleaningPeriods.filter(
      (period) =>
        period.startDate >= currentDate || period.endDate >= currentDate,
    );

    if (aFuturePeriods.length === 0) return 1;
    if (bFuturePeriods.length === 0) return -1;

    const aNextPeriod = aFuturePeriods.sort(
      (p1, p2) => p1.startDate.getTime() - p2.startDate.getTime(),
    )[0];

    const bNextPeriod = bFuturePeriods.sort(
      (p1, p2) => p1.startDate.getTime() - p2.startDate.getTime(),
    )[0];

    return aNextPeriod.startDate.getTime() - bNextPeriod.startDate.getTime();
  });

  const mapAnnouncements: MapAnnouncement[] = sortedAnnouncements.map(
    (announcement) => ({
      id: announcement.id,
      title: announcement.title,
      latitude: announcement.field.latitude,
      longitude: announcement.field.longitude,
      slug: announcement.slug,
    }),
  );

  return (
    <div className="container mx-auto pt-4">
      <SearchWizard cropTypes={cropTypes} initialFilters={filters} />

      <div className="md:hidden mt-2">
        <AnnouncementTabs
          listContent={<AnnouncementList announcements={sortedAnnouncements} />}
          mapContent={<AnnouncementMap announcements={mapAnnouncements} />}
        />
      </div>

      <div className="hidden md:grid md:grid-cols-12 gap-4 mt-2">
        <div className="md:col-span-6 lg:col-span-5">
          <AnnouncementList announcements={sortedAnnouncements} />
        </div>
        <div className="md:col-span-6 lg:col-span-7">
          <AnnouncementMap announcements={mapAnnouncements} />
        </div>
      </div>
    </div>
  );
}
