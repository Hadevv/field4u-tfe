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

export const buildPeriodQuery = (period: PeriodFilter) => {
  if (!period || period === "all") return {};

  const now = new Date();
  let startDate: Date;
  let endDate: Date;

  switch (period) {
    case "today":
      startDate = startOfDay(now);
      endDate = endOfDay(now);
      break;
    case "week":
      startDate = startOfWeek(now, { weekStartsOn: 1 }); // Lundi
      endDate = endOfWeek(now, { weekStartsOn: 1 }); // Dimanche
      break;
    case "month":
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
      break;
    default:
      return {};
  }

  return {
    gleaningPeriods: {
      some: {
        gleaningPeriod: {
          AND: [
            { startDate: { lte: endDate } },
            { endDate: { gte: startDate } },
          ],
        },
      },
    },
  };
};

export const buildSearchQuery = (
  filters: SearchFilters,
): Prisma.AnnouncementWhereInput => {
  const where: Prisma.AnnouncementWhereInput = { isPublished: true };

  if (filters.query) {
    where.OR = [
      { title: { contains: filters.query, mode: "insensitive" } },
      { description: { contains: filters.query, mode: "insensitive" } },
    ];
  }

  if (filters.cropTypeId) {
    where.cropTypeId = filters.cropTypeId;
  }

  if (filters.location) {
    where.field = {
      OR: [
        { city: { contains: filters.location, mode: "insensitive" } },
        { postalCode: { contains: filters.location } },
      ],
    };
  }

  return where;
};
