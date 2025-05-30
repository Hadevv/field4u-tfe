/* eslint-disable @typescript-eslint/no-explicit-any */
import { route } from "@/lib/safe-route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// Fonction de calcul de distance simple (formule haversine)
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371e3; // Rayon de la Terre en mètres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance en mètres
}

export const GET = route
  .query(
    z.object({
      page: z.coerce.number().min(1).max(100).default(1),
      limit: z.coerce.number().min(1).max(50).default(10),
      cropType: z.string().optional(),
      search: z.string().max(100).optional(),
      city: z.string().max(100).optional(),
      // Recherche géographique sécurisée
      lat: z.coerce.number().optional(),
      lng: z.coerce.number().optional(),
      radius: z.coerce.number().min(1).max(50).optional(), // Rayon limité à 50km
    }),
  )
  .handler(async (req, { query }) => {
    const { page, limit, cropType, search, city, lat, lng, radius } = query;
    const skip = (page - 1) * limit;
    const now = new Date();
    const revealTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Recherche standard (avec ou sans géolocalisation)
    const whereConditions: any = {
      isPublished: true,
    };

    if (search) {
      whereConditions.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (cropType) {
      whereConditions.cropTypeId = cropType;
    }

    if (city) {
      whereConditions.field = {
        city: { contains: city, mode: "insensitive" },
      };
    }

    const [standardAnnouncements, total] = await Promise.all([
      prisma.announcement.findMany({
        where: whereConditions,
        skip,
        take: limit,
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
              id: true,
              name: true,
              city: true,
              postalCode: true,
              surface: true,
              latitude: true,
              longitude: true,
            },
          },
          cropType: {
            select: {
              id: true,
              name: true,
              category: true,
              season: true,
            },
          },
          owner: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.announcement.count({ where: whereConditions }),
    ]);

    // Filtrage géographique côté application si coordonnées fournies
    let filteredAnnouncements = standardAnnouncements;
    let geoMeta = {};

    if (lat && lng && radius) {
      const radiusMeters = radius * 1000;

      filteredAnnouncements = standardAnnouncements.filter((announcement) => {
        if (!announcement.field?.latitude || !announcement.field?.longitude) {
          return false;
        }

        const distance = calculateDistance(
          lat,
          lng,
          announcement.field.latitude,
          announcement.field.longitude,
        );

        return distance <= radiusMeters;
      });

      // Trier par distance
      filteredAnnouncements.sort((a, b) => {
        const distanceA = calculateDistance(
          lat,
          lng,
          a.field!.latitude!,
          a.field!.longitude!,
        );
        const distanceB = calculateDistance(
          lat,
          lng,
          b.field!.latitude!,
          b.field!.longitude!,
        );
        return distanceA - distanceB;
      });

      geoMeta = {
        searchRadius: radius,
        userLocation: { lat, lng },
        filteredByDistance: true,
      };
    }

    // SÉCURITÉ : Anonymiser les IDs et supprimer les coordonnées selon la règle des 24h
    const sanitizedAnnouncements = filteredAnnouncements.map((announcement) => {
      const timeUntilStart = announcement.startDate
        ? new Date(announcement.startDate).getTime() - now.getTime()
        : Infinity;
      const canRevealLocation = timeUntilStart <= 24 * 60 * 60 * 1000; // 24h en millisecondes

      return {
        ...announcement,
        id: announcement.id.slice(0, 8) + "...",
        field: {
          id: announcement.field?.id?.slice(0, 8) + "..." || null,
          name: announcement.field?.name,
          city: announcement.field?.city,
          postalCode: announcement.field?.postalCode,
          surface: announcement.field?.surface,
          // SÉCURITÉ : coordonnées révélées seulement 24h avant
          ...(canRevealLocation
            ? {
                latitude: announcement.field?.latitude,
                longitude: announcement.field?.longitude,
                locationRevealed: true,
              }
            : {
                locationRevealed: false,
              }),
        },
        owner: {
          ...announcement.owner,
          id: announcement.owner.id.slice(0, 8) + "...",
        },
        cropType: {
          ...announcement.cropType,
          id: announcement.cropType.id.slice(0, 8) + "...",
        },
      };
    });

    return NextResponse.json({
      data: sanitizedAnnouncements,
      meta: {
        total: filteredAnnouncements.length,
        page,
        limit,
        totalPages: Math.ceil(filteredAnnouncements.length / limit),
        ...geoMeta,
      },
    });
  });
