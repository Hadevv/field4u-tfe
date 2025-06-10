/* eslint-disable @typescript-eslint/no-empty-object-type */
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import type { PageParams } from "@/types/next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth/helper";
import { Prisma } from "@prisma/client";
import { GleaningsTableContainer } from "@/features/admin/gleanings/GleaningsTableContainer";

export const metadata = {
  title: "Gestion des glanages | Field4u Admin",
  description: "Gérez les sessions de glanage de la plateforme Field4u",
};

export default async function GleaningsPage(props: PageParams<{}>) {
  await isAdmin();

  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const pageSize = 10;
  const search =
    typeof searchParams.search === "string" ? searchParams.search : "";
  const status =
    typeof searchParams.status === "string" ? searchParams.status : undefined;

  let whereClause: Prisma.GleaningWhereInput = {};
  const now = new Date();

  if (search) {
    whereClause = {
      ...whereClause,
      OR: [
        {
          announcement: {
            title: {
              contains: search,
              mode: "insensitive" as Prisma.QueryMode,
            },
          },
        },
        {
          announcement: {
            owner: {
              name: {
                contains: search,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
          },
        },
        {
          announcement: {
            field: {
              city: {
                contains: search,
                mode: "insensitive" as Prisma.QueryMode,
              },
            },
          },
        },
      ],
    };
  }

  // Appliquer le filtre de statut plus précisément
  if (status) {
    if (status === "NOT_STARTED") {
      whereClause = {
        ...whereClause,
        status: "NOT_STARTED",
        announcement: {
          startDate: { gt: now },
        },
      };
    } else if (status === "IN_PROGRESS") {
      whereClause = {
        ...whereClause,
        status: "IN_PROGRESS",
        announcement: {
          startDate: { lte: now },
          OR: [{ endDate: { gte: now } }, { endDate: null }],
        },
      };
    } else if (status === "COMPLETED") {
      whereClause = {
        ...whereClause,
        status: "COMPLETED",
        announcement: {
          endDate: { lt: now },
        },
      };
    } else if (status === "CANCELLED") {
      whereClause = {
        ...whereClause,
        status: "CANCELLED",
      };
    }
  }

  const totalGleanings = await prisma.gleaning.count({
    where: whereClause,
  });

  const totalPages = Math.ceil(totalGleanings / pageSize);

  const gleanings = await prisma.gleaning.findMany({
    where: whereClause,
    orderBy: [{ createdAt: "desc" }],
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      announcement: {
        include: {
          field: true,
          cropType: true,
          owner: true,
        },
      },
      participations: {
        include: {
          user: true,
        },
      },
      _count: {
        select: {
          participations: true,
          reviews: true,
        },
      },
    },
  });

  return (
    <Layout size="full">
      <LayoutHeader>
        <LayoutTitle>gestion des glanages</LayoutTitle>
      </LayoutHeader>
      <LayoutContent>
        <Suspense>
          <GleaningsTableContainer
            initialGleanings={gleanings}
            page={page}
            totalPages={totalPages}
            search={search}
            status={status}
          />
        </Suspense>
      </LayoutContent>
    </Layout>
  );
}
