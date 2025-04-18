import { route } from "@/lib/safe-route";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  getGleaningStatusInfo,
} from "../../announcements/_components/types";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/helper";
import {
  buildSearchQuery,
  buildPeriodQuery,
} from "../../announcements/_queries/announcement.query";

const SearchParamsSchema = z.object({
  q: z.string().optional(),
  crop: z.string().optional(),
  location: z.string().optional(),
  radius: z.string().optional().default("25"),
  period: z.enum(["today", "week", "month"]).optional(),
  _t: z.string().optional(), // timestamp pour eviter la mise en cache
  initial: z.string().optional(),
  reset: z.string().optional(),
});

export const GET = route
  .query(SearchParamsSchema)
  .handler(async (req, { query }) => {
    try {
      const user = await auth();

      // determiner si c'est un chargement initial ou une reset
      const isInitial = query.initial === "true";
      const isReset = query.reset === "true";

      // convertir les paramètres en filtres
      const filters = {
        query: isInitial || isReset ? null : query.q || null,
        cropTypeId: isInitial || isReset ? null : query.crop || null,
        location: isInitial || isReset ? null : query.location || null,
        radius: isInitial || isReset ? "25" : query.radius || "25",
        period: isInitial || isReset ? null : query.period || null,
      };

      // requete de base
      const baseQuery = buildSearchQuery(filters, isInitial || isReset);
      let where = baseQuery;

      // filtre par période
      if (!isInitial && !isReset && filters.period) {
        const periodQuery = buildPeriodQuery(filters.period);
        if (Object.keys(periodQuery).length > 0) {
          where = {
            ...baseQuery,
            ...periodQuery,
          };
        }
      }

      // recup des annonces
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
          startDate: true,
          endDate: true,
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
          owner: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          gleaning: {
            select: {
              id: true,
              status: true,
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
      });

      // formatage des result
      const formattedAnnouncements = announcements.map((announcement) => {
        const startDate = announcement.startDate
          ? new Date(announcement.startDate)
          : null;
        const endDate = announcement.endDate
          ? new Date(announcement.endDate)
          : null;

        // le statut de l'annonce
        const statusInfo = getGleaningStatusInfo(
          startDate,
          endDate,
          announcement.gleaning?.status,
        );

        return {
          ...announcement,
          startDate,
          endDate,
          status: statusInfo.status,
          isLiked: announcement.likes && announcement.likes.length > 0,
        };
      });

      // exclure les annonces terminé ou annulé
      const filteredAnnouncements = formattedAnnouncements.filter(
        (a) => a.status !== "COMPLETED" && a.status !== "CANCELLED",
      );

      // tri des annonces par statut et date
      const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
        // priorité aux annonces en cours
        if (a.status === "IN_PROGRESS" && b.status !== "IN_PROGRESS") return -1;
        if (b.status === "IN_PROGRESS" && a.status !== "IN_PROGRESS") return 1;

        if (a.startDate && b.startDate) {
          return a.startDate.getTime() - b.startDate.getTime();
        }

        return 0;
      });

      // préparation des donnes pour la carte
      const mapAnnouncements = sortedAnnouncements.map((announcement) => ({
        id: announcement.id,
        title: announcement.title,
        latitude: announcement.field.latitude,
        longitude: announcement.field.longitude,
        slug: announcement.slug,
      }));

      // return résultat
      return NextResponse.json({
        announcements: sortedAnnouncements,
        mapAnnouncements,
      });
    } catch (error) {
      console.error("erreur de recherche:", error);
      return NextResponse.json(
        { error: "erreur lors de la recherche" },
        { status: 500 },
      );
    }
  });
