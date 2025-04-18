/* eslint-disable no-useless-escape */
import { PeriodFilter } from "@/types/announcement";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";

/**
 * construit une requête pour les périodes
 */
export const buildPeriodQuery = (period: PeriodFilter) => {
  if (!period) return {};

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
      return {};
  }

  logger.debug(`Filtre période: ${period}`);
  logger.debug(`Date de début: ${startDate.toISOString()}`);
  logger.debug(`Date de fin: ${endDate.toISOString()}`);

  return {
    OR: [
      // commence pendant la période
      {
        startDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      // se termine pendant la période
      {
        endDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      // englobe la période entière
      {
        startDate: { lte: startDate },
        endDate: { gte: endDate },
      },
      // en cours pendant la période
      {
        startDate: { lte: now },
        endDate: { gte: now },
      },
    ],
  };
};

/**
 * recherche des annonces par titre avec unaccent
 */
export const searchAnnouncementsByTitle = async (searchTerm: string) => {
  if (!searchTerm || searchTerm.trim() === "") {
    return [];
  }

  try {
    const safeSearchTerm = searchTerm
      .trim()
      .replace(/[%_'"\\\[\]]/g, "")
      .slice(0, 50);
    const searchParam = `%${safeSearchTerm}%`;

    logger.debug(`Recherche par titre avec terme nettoyé: "${safeSearchTerm}"`);

    // requete sql brute pour garantir l'utilisation de unaccent
    const results = await prisma.$queryRaw<{ id: string }[]>`
      SELECT a.id
      FROM "announcements" a
      WHERE unaccent(lower(a.title)) LIKE unaccent(lower(${searchParam}))
    `;

    return results.map((r) => r.id);
  } catch (error) {
    logger.error("Erreur lors de la recherche par titre avec unaccent:", error);
    try {
      logger.debug("Tentative de fallback sans unaccent");
      const safeSearchTerm = searchTerm
        .trim()
        .replace(/[%_'"\\\[\]]/g, "")
        .slice(0, 50);

      const fallbackResults = await prisma.announcement.findMany({
        where: {
          title: {
            contains: safeSearchTerm,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
        },
      });

      return fallbackResults.map((r) => r.id);
    } catch (fallbackError) {
      logger.error("Erreur lors de la tentative de fallback:", fallbackError);
      return [];
    }
  }
};

/**
 * recherche des annonces par localisation avec unaccent
 */
export const searchAnnouncementsByLocation = async (locationTerm: string) => {
  if (!locationTerm || locationTerm.trim() === "") {
    return [];
  }

  try {
    const safeLocationTerm = locationTerm
      .trim()
      .replace(/[%_'"\\\[\]]/g, "")
      .slice(0, 50);
    const locationParam = `%${safeLocationTerm}%`;

    logger.debug(
      `Recherche par localisation avec terme nettoyé: "${safeLocationTerm}"`,
    );

    const results = await prisma.$queryRaw<{ id: string }[]>`
      SELECT a.id
      FROM "announcements" a
      JOIN "fields" f ON a."field_id" = f.id
      WHERE 
        unaccent(lower(f.city)) LIKE unaccent(lower(${locationParam}))
        OR f."postal_code" LIKE ${locationParam}
    `;

    return results.map((r) => r.id);
  } catch (error) {
    logger.error(
      "Erreur lors de la recherche par location avec unaccent:",
      error,
    );

    try {
      logger.debug("Tentative de fallback sans unaccent pour localisation");
      const safeLocationTerm = locationTerm
        .trim()
        .replace(/[%_'"\\\[\]]/g, "")
        .slice(0, 50);

      const fallbackResults = await prisma.announcement.findMany({
        where: {
          field: {
            OR: [
              {
                city: {
                  contains: safeLocationTerm,
                  mode: "insensitive",
                },
              },
              {
                postalCode: {
                  contains: safeLocationTerm,
                },
              },
            ],
          },
        },
        select: {
          id: true,
        },
      });

      return fallbackResults.map((r) => r.id);
    } catch (fallbackError) {
      logger.error(
        "Erreur lors de la tentative de fallback pour localisation:",
        fallbackError,
      );
      return [];
    }
  }
};
