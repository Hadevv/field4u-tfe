/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Button } from "@/components/ui/button";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import type { PageParams } from "@/types/next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { AnnouncementTableContainer } from "@/features/admin/announcements/AnnouncementTableContainer";
import { isAdmin } from "@/lib/auth/helper";
import { Plus } from "lucide-react";
import { Prisma } from "@prisma/client";

export const metadata = {
  title: "Gestion des annonces | Field4u Admin",
  description: "Gérez les annonces de glanage sur la plateforme Field4u",
};

export default async function AnnouncementsPage(props: PageParams<{}>) {
  await isAdmin();

  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const pageSize = 10;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : "";
  const status =
    typeof searchParams.status === "string" ? searchParams.status : "all";
  let whereClause: Prisma.AnnouncementWhereInput = {};

  if (search) {
    whereClause = {
      OR: [
        {
          title: { contains: search, mode: "insensitive" as Prisma.QueryMode },
        },
        {
          description: {
            contains: search,
            mode: "insensitive" as Prisma.QueryMode,
          },
        },
        {
          field: {
            city: { contains: search, mode: "insensitive" as Prisma.QueryMode },
          },
        },
        {
          field: {
            postalCode: {
              contains: search,
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
        },
      ],
    };
  }

  // filtres par statut
  const now = new Date();

  if (status !== "all") {
    if (status === "published") {
      whereClause = {
        ...whereClause,
        isPublished: true,
      };
    } else if (status === "draft") {
      whereClause = {
        ...whereClause,
        isPublished: false,
      };
    } else if (status === "active") {
      whereClause = {
        ...whereClause,
        isPublished: true,
        startDate: { lte: now },
        OR: [{ endDate: { gte: now } }, { endDate: null }],
        gleaning: {
          status: {
            not: "CANCELLED",
          },
        },
      };
    } else if (status === "finished") {
      whereClause = {
        ...whereClause,
        AND: [
          { endDate: { lt: now } },
          {
            OR: [
              { gleaning: { status: "COMPLETED" } },
              { gleaning: { is: null } },
            ],
          },
        ],
      };
    } else if (status === "upcoming") {
      whereClause = {
        ...whereClause,
        isPublished: true,
        startDate: { gt: now },
        gleaning: {
          status: {
            not: "CANCELLED",
          },
        },
      };
    } else if (status === "cancelled") {
      whereClause = {
        ...whereClause,
        gleaning: {
          status: "CANCELLED",
        },
      };
    }
  }

  const totalAnnouncements = await prisma.announcement.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(totalAnnouncements / pageSize);

  const announcements = await prisma.announcement.findMany({
    where: whereClause,
    include: {
      field: {
        include: {
          farm: true,
          owner: true,
        },
      },
      cropType: true,
      owner: true,
      gleaning: true,
    },
    orderBy: [{ createdAt: "desc" }],
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const fields = await prisma.field.findMany({
    include: {
      farm: true,
      owner: true,
    },
    orderBy: [{ name: "asc" }],
  });

  const cropTypes = await prisma.cropType.findMany({
    orderBy: [{ name: "asc" }],
  });

  const users = await prisma.user.findMany({
    where: {
      deletedAt: null,
    },
    orderBy: [{ name: "asc" }],
  });

  return (
    <Layout size="full">
      <LayoutHeader>
        <LayoutTitle>gestion des annonces</LayoutTitle>
      </LayoutHeader>
      <LayoutContent>
        <Suspense>
          <AnnouncementTableContainer
            initialAnnouncements={announcements}
            page={page}
            totalPages={totalPages}
            search={search}
            status={status}
            fields={fields}
            cropTypes={cropTypes}
            users={users}
            createButtonSlot={
              <Button
                variant="default"
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Plus className="mr-2 size-4" />
                nouvelle annonce
              </Button>
            }
          />
        </Suspense>
      </LayoutContent>
    </Layout>
  );
}
