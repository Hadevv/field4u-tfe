import { route } from "@/lib/safe-route";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getGleaningStatusInfo } from "@/lib/format/gleaningStatus";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/helper";
import {
  buildPeriodQuery,
  searchAnnouncementsByTitle,
  searchAnnouncementsByLocation,
} from "../../../src/query/announcement.query";
import { logger } from "@/lib/logger";
import { Prisma } from "@prisma/client";

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
      const startTime = Date.now();
      logger.debug(`Recherche initiée avec paramètres:`, query);

      const user = await auth();

      // determiner si c'est un chargement initial ou une reset
      const isInitial = query.initial === "true";
      const isReset = query.reset === "true";

      // normalisation des params
      const searchTerm = isInitial || isReset ? null : query.q || null;
      const locationTerm = isInitial || isReset ? null : query.location || null;
      const periodTerm = isInitial || isReset ? null : query.period || null;

      // convertir les params en filtre
      const filters = {
        query: searchTerm,
        cropTypeId: isInitial || isReset ? null : query.crop || null,
        location: locationTerm,
        radius: isInitial || isReset ? "25" : query.radius || "25",
        period: periodTerm,
      };

      logger.debug(`Filtres appliqués:`, filters);

      // requete de base avec la structure prisma
      const where: Prisma.AnnouncementWhereInput = {
        isPublished: true,
      };

      // ajouter le filtre par type de culture
      if (filters.cropTypeId) {
        where.cropTypeId = filters.cropTypeId;
      }

      // ajouter le filtre par période
      if (filters.period) {
        const periodQuery = buildPeriodQuery(filters.period);
        if (Object.keys(periodQuery).length > 0) {
          Object.assign(where, periodQuery);
        }
      }

      // rechercher par titre
      let titleSearchIds: string[] = [];
      try {
        if (searchTerm) {
          logger.debug(`Recherche par titre pour: ${searchTerm}`);
          titleSearchIds = await searchAnnouncementsByTitle(searchTerm);
          logger.debug(`Résultats trouvés par titre: ${titleSearchIds.length}`);

          if (titleSearchIds.length > 0) {
            where.id = { in: titleSearchIds };
          } else if (searchTerm) {
            return NextResponse.json({
              announcements: [],
              mapAnnouncements: [],
            });
          }
        }
      } catch (error) {
        logger.error(`Erreur pendant la recherche par titre:`, error);
      }

      // rechercher par localisation
      if (locationTerm) {
        try {
          logger.debug(`Recherche par localisation pour: ${locationTerm}`);
          const locationSearchIds =
            await searchAnnouncementsByLocation(locationTerm);
          logger.debug(
            `Résultats trouvés par localisation: ${locationSearchIds.length}`,
          );

          if (titleSearchIds.length > 0 && where.id) {
            const intersectionIds = titleSearchIds.filter((id) =>
              locationSearchIds.includes(id),
            );

            if (intersectionIds.length > 0) {
              where.id = { in: intersectionIds };
            } else {
              return NextResponse.json({
                announcements: [],
                mapAnnouncements: [],
              });
            }
          } else if (locationSearchIds.length > 0) {
            where.id = { in: locationSearchIds };
          } else {
            return NextResponse.json({
              announcements: [],
              mapAnnouncements: [],
            });
          }
        } catch (error) {
          logger.error(`Erreur pendant la recherche par localisation:`, error);
          if (titleSearchIds.length > 0 && where.id) {
            where.id = { in: titleSearchIds };
          }
        }
      }

      try {
        logger.debug(`Filtre final:`, JSON.stringify(where));
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
            _count: {
              select: {
                likes: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        logger.debug(`Nombre d'annonces trouvées: ${announcements.length}`);
        const formattedAnnouncements = announcements.map((announcement) => {
          const startDate = announcement.startDate
            ? new Date(announcement.startDate)
            : null;
          const endDate = announcement.endDate
            ? new Date(announcement.endDate)
            : null;

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
            likeCount: announcement._count.likes,
          };
        });

        // exclure les annonces terminé
        const filteredAnnouncements = formattedAnnouncements.filter(
          (a) => a.status !== "COMPLETED" && a.status !== "CANCELLED",
        );

        // tri des annonces par statut et date
        const sortedAnnouncements = [...filteredAnnouncements].sort((a, b) => {
          // priorité aux annonces en cours
          if (a.status === "IN_PROGRESS" && b.status !== "IN_PROGRESS")
            return -1;
          if (b.status === "IN_PROGRESS" && a.status !== "IN_PROGRESS")
            return 1;

          if (a.startDate && b.startDate) {
            return a.startDate.getTime() - b.startDate.getTime();
          }

          return 0;
        });

        // prepare data pour la map
        const mapAnnouncements = sortedAnnouncements.map((announcement) => ({
          id: announcement.id,
          title: announcement.title,
          latitude: announcement.field.latitude,
          longitude: announcement.field.longitude,
          slug: announcement.slug,
        }));

        const endTime = Date.now();
        logger.debug(
          `Recherche terminée en ${endTime - startTime}ms - ${sortedAnnouncements.length} résultats`,
        );

        return NextResponse.json({
          announcements: sortedAnnouncements,
          mapAnnouncements,
        });
      } catch (error) {
        logger.error(`Erreur pendant la requête principale:`, error);
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;

        logger.error(`Message d'erreur: ${errorMessage}`);
        if (errorStack) {
          logger.error(`Stack trace: ${errorStack}`);
        }

        return NextResponse.json({
          announcements: [],
          mapAnnouncements: [],
          error: errorMessage,
        });
      }
    } catch (error) {
      logger.error("Erreur de recherche:", error);
      return NextResponse.json(
        {
          error: "erreur lors de la recherche",
          message: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        { status: 500 },
      );
    }
  });
