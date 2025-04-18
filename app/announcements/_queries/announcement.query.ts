import { Prisma } from "@prisma/client";
import { SearchFilters, PeriodFilter } from "../_components/types";
import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { logger } from "@/lib/logger";

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

export const buildDefaultQuery = (): Prisma.AnnouncementWhereInput => {
  const now = new Date();
  return {
    isPublished: true,
    OR: [
      { endDate: { gte: now } },
      {
        startDate: { lte: now },
        endDate: { gte: now },
      },
    ],
    gleaning: {
      status: { not: { equals: "CANCELLED" } },
    },
  };
};

export const buildSearchQuery = (
  filters: SearchFilters,
  includeAll: boolean = false,
): Prisma.AnnouncementWhereInput => {
  // Base query
  const where: Prisma.AnnouncementWhereInput = {
    isPublished: true,
  };
  if (includeAll) {
    return buildDefaultQuery();
  }

  const conditions: Prisma.AnnouncementWhereInput[] = [];

  // recherche par texte
  if (filters.query) {
    const searchTerms = filters.query.toLowerCase().split(" ");
    conditions.push({
      OR: searchTerms.map((term) => ({
        OR: [
          { title: { contains: term, mode: "insensitive" } },
          { description: { contains: term, mode: "insensitive" } },
        ],
      })),
    });
  }

  // filtre par type de culture
  if (filters.cropTypeId) {
    conditions.push({ cropTypeId: filters.cropTypeId });
  }

  // recherche par localisation
  if (filters.location) {
    const locationTerms = filters.location.toLowerCase().split(" ");
    conditions.push({
      field: {
        OR: locationTerms.map((term) => ({
          OR: [
            { city: { contains: term, mode: "insensitive" } },
            { postalCode: { contains: term } },
          ],
        })),
      },
    });
  }

  // combiner toutes les conditions
  if (conditions.length > 0) {
    where.AND = conditions;
  }

  return where;
};
