import { route } from "@/lib/safe-route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { GleaningStatus } from "@prisma/client";

// recup les glanages disponibles avec filtres
export const GET = route
  .query(
    z.object({
      page: z.coerce.number().default(1),
      limit: z.coerce.number().default(10),
      status: z.nativeEnum(GleaningStatus).optional(),
    }),
  )
  .handler(async (req, { query }) => {
    const { page, limit, status } = query;
    const skip = (page - 1) * limit;

    const where = {
      ...(status ? { status } : {}),
    };

    const [gleanings, total] = await Promise.all([
      prisma.gleaning.findMany({
        where,
        skip,
        take: limit,
        include: {
          announcement: {
            include: {
              field: true,
              cropType: true,
              owner: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
          participations: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.gleaning.count({ where }),
    ]);

    return NextResponse.json({
      data: gleanings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  });
