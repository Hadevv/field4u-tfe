import { route, RouteError } from "@/lib/safe-route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// récupérer les avis d'un glanage spécifique
export const GET = route
  .params(
    z.object({
      id: z.string().min(1).max(50),
    }),
  )
  .handler(async (req, { params }) => {
    const { id: gleaningId } = params;

    // vérifier que le glanage existe et est public
    const gleaning = await prisma.gleaning.findUnique({
      where: { id: gleaningId },
      select: {
        id: true,
        status: true,
        announcement: {
          select: {
            isPublished: true,
            title: true,
          },
        },
      },
    });

    if (!gleaning || !gleaning.announcement.isPublished) {
      throw new RouteError("Glanage non trouvé", 404);
    }

    // récupérer les avis publics seulement pour les glanages terminés
    if (gleaning.status !== "COMPLETED") {
      throw new RouteError(
        "Les avis ne sont disponibles que pour les glanages terminés",
        400,
      );
    }

    const reviews = await prisma.review.findMany({
      where: {
        gleaningId,
      },
      select: {
        id: true,
        rating: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            // Pas d'ID ou d'email pour protéger la vie privée
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // anonymiser les avis
    const sanitizedReviews = reviews.map((review) => ({
      id: review.id.slice(0, 8) + "...",
      rating: review.rating,
      content: review.content,
      createdAt: review.createdAt.toISOString().split("T")[0], // Seulement la date
      reviewer: {
        name: review.user.name,
      },
    }));

    // calculer les statistiques des avis
    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews
        : 0;

    return NextResponse.json({
      data: sanitizedReviews,
      meta: {
        total: totalReviews,
        averageRating: Math.round(averageRating * 10) / 10, // Arrondi à 1 décimale
        gleaningStatus: gleaning.status,
        gleaningTitle: gleaning.announcement.title,
      },
    });
  });
