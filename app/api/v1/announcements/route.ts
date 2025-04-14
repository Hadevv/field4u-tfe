/* eslint-disable @typescript-eslint/no-explicit-any */
import { route } from "@/lib/safe-route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = route
  .query(
    z.object({
      page: z.coerce.number().default(1),
      limit: z.coerce.number().default(10),
      cropType: z.string().optional(),
      search: z.string().optional(),
      lat: z.coerce.number().optional(),
      lng: z.coerce.number().optional(),
      distance: z.coerce.number().optional(),
    }),
  )
  .handler(async (req, { query }) => {
    const { page, limit, cropType, search, lat, lng, distance } = query;
    const skip = (page - 1) * limit;

    // filtrage géographique si lat/lng/distance
    if (lat && lng && distance) {
      // on utilise postgis
      const announcements = await prisma.$queryRaw`
        SELECT a.*, 
          ST_Distance(
            ST_MakePoint(f.longitude, f.latitude)::geography,
            ST_MakePoint(${lng}, ${lat})::geography
          ) as distance
        FROM "announcements" a
        JOIN "fields" f ON a."field_id" = f.id
        WHERE a."is_published" = true
        ${cropType ? `AND a."crop_type_id" = ${cropType}` : ""}
        ${search ? `AND (a."title" ILIKE '%${search}%' OR a."description" ILIKE '%${search}%')` : ""}
        HAVING ST_Distance(
          ST_MakePoint(f.longitude, f.latitude)::geography,
          ST_MakePoint(${lng}, ${lat})::geography
        ) <= ${distance * 1000}
        ORDER BY distance
        LIMIT ${limit}
        OFFSET ${skip}
      `;

      const total = await prisma.$queryRaw`
        SELECT COUNT(*)
        FROM "announcements" a
        JOIN "fields" f ON a."field_id" = f.id
        WHERE a."is_published" = true
        ${cropType ? `AND a."crop_type_id" = ${cropType}` : ""}
        ${search ? `AND (a."title" ILIKE '%${search}%' OR a."description" ILIKE '%${search}%')` : ""}
        AND ST_Distance(
          ST_MakePoint(f.longitude, f.latitude)::geography,
          ST_MakePoint(${lng}, ${lat})::geography
        ) <= ${distance * 1000}
      `;

      return NextResponse.json({
        data: announcements,
        meta: {
          total: Number((total as any)[0]?.count ?? 0),
          page,
          limit,
          totalPages: Math.ceil(Number((total as any)[0]?.count ?? 0) / limit),
        },
      });
    }

    // requête normale sans filtrage géo
    const [announcements, total] = await Promise.all([
      prisma.announcement.findMany({
        where: {
          OR: search
            ? [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ]
            : undefined,
          cropTypeId: cropType,
          isPublished: true,
        },
        skip,
        take: limit,
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
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.announcement.count({
        where: {
          OR: search
            ? [
                { title: { contains: search, mode: "insensitive" } },
                { description: { contains: search, mode: "insensitive" } },
              ]
            : undefined,
          cropTypeId: cropType,
          isPublished: true,
        },
      }),
    ]);

    return NextResponse.json({
      data: announcements,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  });
