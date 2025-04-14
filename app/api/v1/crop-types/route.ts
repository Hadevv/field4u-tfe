import { route } from "@/lib/safe-route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { CropCategory, CropSeason } from "@prisma/client";

// recup tous les types de cultures avec filtres
export const GET = route
  .query(
    z.object({
      category: z.nativeEnum(CropCategory).optional(),
      season: z.nativeEnum(CropSeason).optional(),
    }),
  )
  .handler(async (req, { query }) => {
    const { category, season } = query;

    const where = {
      ...(category ? { category } : {}),
      ...(season ? { season } : {}),
    };

    const cropTypes = await prisma.cropType.findMany({
      where,
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(cropTypes);
  });
