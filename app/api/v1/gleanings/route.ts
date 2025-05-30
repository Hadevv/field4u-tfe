import { route } from "@/lib/safe-route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { GleaningStatus, type Prisma } from "@prisma/client";

// recup les glanages disponibles avec filtres
export const GET = route
  .query(
    z.object({
      page: z.coerce.number().min(1).max(100).default(1),
      limit: z.coerce.number().min(1).max(50).default(10),
      status: z.nativeEnum(GleaningStatus).optional(),
      city: z.string().max(100).optional(),
    }),
  )
  .handler(async (req, { query }) => {
    const { page, limit, status, city } = query;
    const skip = (page - 1) * limit;

    const whereConditions: Prisma.GleaningWhereInput = {
      announcement: {
        isPublished: true,
      },
    };

    if (status) {
      whereConditions.status = status;
    }

    if (city) {
      whereConditions.announcement = {
        isPublished: true,
        field: {
          city: { contains: city, mode: "insensitive" },
        },
      };
    }

    const [gleanings, total] = await Promise.all([
      prisma.gleaning.findMany({
        where: whereConditions,
        skip,
        take: limit,
        select: {
          id: true,
          status: true,
          createdAt: true,
          announcement: {
            select: {
              title: true,
              startDate: true,
              endDate: true,
              quantityAvailable: true,
              field: {
                select: {
                  name: true,
                  city: true,
                  postalCode: true,
                  // Pas de coordonnées
                },
              },
              cropType: {
                select: {
                  name: true,
                  category: true,
                },
              },
              owner: {
                select: {
                  name: true,
                  // Pas d'ID ou d'image
                },
              },
            },
          },
          _count: {
            select: {
              participations: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.gleaning.count({ where: whereConditions }),
    ]);

    // Anonymiser les IDs
    const sanitizedGleanings = gleanings.map((gleaning) => ({
      ...gleaning,
      id: gleaning.id.slice(0, 8) + "...",
    }));

    return NextResponse.json({
      data: sanitizedGleanings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  });
