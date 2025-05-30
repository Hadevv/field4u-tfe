import { authRoute, RouteError } from "@/lib/safe-route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { NotificationType } from "@prisma/client";

// rejoindre un glanage en tant qu'utilisateur
export const POST = authRoute
  .body(
    z.object({
      gleaningId: z.string().min(1).max(50),
    }),
  )
  .handler(async (req, { body, data }) => {
    const { gleaningId } = body;
    const { user } = data;

    // vérifier que le glanage existe et est disponible
    const gleaning = await prisma.gleaning.findUnique({
      where: { id: gleaningId },
      select: {
        id: true,
        status: true,
        announcement: {
          select: {
            id: true,
            ownerId: true,
            isPublished: true,
            startDate: true,
            endDate: true,
          },
        },
        _count: {
          select: {
            participations: true,
          },
        },
      },
    });

    if (!gleaning || !gleaning.announcement.isPublished) {
      throw new RouteError("Glanage non trouvé ou indisponible", 404);
    }

    // vérifier que l'utilisateur n'est pas le propriétaire
    if (gleaning.announcement.ownerId === user.id) {
      throw new RouteError(
        "Vous ne pouvez pas rejoindre votre propre glanage",
        400,
      );
    }

    // vérifier que le glanage n'est pas déjà commencé/terminé
    if (gleaning.status !== "NOT_STARTED") {
      throw new RouteError(
        "Ce glanage n'est plus disponible pour rejoindre",
        400,
      );
    }

    // vérifier si l'utilisateur n'a pas déjà rejoint
    const existingParticipation = await prisma.participation.findFirst({
      where: {
        userId: user.id,
        gleaningId,
      },
    });

    if (existingParticipation) {
      throw new RouteError("Vous avez déjà rejoint ce glanage", 400);
    }

    // rejoindre le glanage
    const participation = await prisma.participation.create({
      data: {
        userId: user.id,
        gleaningId,
      },
    });

    // créer une notification pour l'agriculteur
    await prisma.notification.create({
      data: {
        userId: gleaning.announcement.ownerId,
        type: NotificationType.PARTICIPATION_JOINED,
        message: `${user.name} a rejoint votre session de glanage`,
      },
    });

    // retourner seulement les informations nécessaires
    return NextResponse.json({
      success: true,
      message: "Vous avez rejoint le glanage avec succès",
      participationId: participation.id.slice(0, 8) + "...", // ID anonymisé
    });
  });

// quitter un glanage
export const DELETE = authRoute
  .body(
    z.object({
      gleaningId: z.string().min(1).max(50),
    }),
  )
  .handler(async (req, { body, data }) => {
    const { gleaningId } = body;
    const { user } = data;

    const participation = await prisma.participation.findFirst({
      where: {
        userId: user.id,
        gleaningId,
      },
    });

    if (!participation) {
      throw new RouteError("Vous n'avez pas rejoint ce glanage", 404);
    }

    await prisma.participation.delete({
      where: {
        id: participation.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Vous avez quitté le glanage avec succès",
    });
  });
