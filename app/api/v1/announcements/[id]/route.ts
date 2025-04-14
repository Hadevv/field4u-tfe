import { route, RouteError } from "@/lib/safe-route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = route
  .params(
    z.object({
      id: z.string(),
    }),
  )
  .handler(async (req, { params }) => {
    const { id } = params;

    const announcement = await prisma.announcement.findUnique({
      where: { id },
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
        gleaning: {
          include: {
            participations: {
              select: {
                id: true,
                userId: true,
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
        },
      },
    });

    if (!announcement) {
      throw new RouteError("Annonce non trouvée", 404);
    }

    return NextResponse.json(announcement);
  });
