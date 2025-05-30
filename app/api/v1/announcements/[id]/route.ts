import { route, RouteError } from "@/lib/safe-route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = route
  .params(
    z.object({
      id: z.string().min(1).max(50),
    }),
  )
  .handler(async (req, { params }) => {
    const { id } = params;

    const announcement = await prisma.announcement.findUnique({
      where: {
        id,
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        quantityAvailable: true,
        startDate: true,
        endDate: true,
        suggestedPrice: true,
        createdAt: true,
        field: {
          select: {
            name: true,
            city: true,
            postalCode: true,
            surface: true,
          },
        },
        cropType: {
          select: {
            name: true,
            category: true,
            season: true,
          },
        },
        owner: {
          select: {
            name: true,
          },
        },
        gleaning: {
          select: {
            status: true,
            _count: {
              select: {
                participations: true,
              },
            },
          },
        },
      },
    });

    if (!announcement) {
      throw new RouteError("Annonce non trouvée", 404);
    }

    const sanitizedAnnouncement = {
      ...announcement,
      id: announcement.id.slice(0, 8) + "...",
    };

    return NextResponse.json(sanitizedAnnouncement);
  });
