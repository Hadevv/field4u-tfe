import { authRoute, RouteError } from "@/lib/safe-route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// rejoindre un glanage en tant qu'utilisateur
export const POST = authRoute
  .body(
    z.object({
      gleaningId: z.string(),
    }),
  )
  .handler(async (req, { body, data }) => {
    const { gleaningId } = body;
    const { user } = data;

    // verifier que le glanage existe
    const gleaning = await prisma.gleaning.findUnique({
      where: { id: gleaningId },
      include: {
        announcement: true,
        participations: true,
      },
    });

    if (!gleaning) {
      throw new RouteError("Glanage non trouvé", 404);
    }

    // verifier si l'utilisateur n'est pas déjà inscrit
    const existingParticipation = await prisma.participation.findFirst({
      where: {
        userId: user.id,
        gleaningId,
      },
    });

    if (existingParticipation) {
      throw new RouteError("Vous êtes déjà inscrit à ce glanage", 400);
    }

    // créer la participation
    const participation = await prisma.participation.create({
      data: {
        userId: user.id,
        gleaningId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        gleaning: true,
      },
    });

    // créer une notification pour l'agriculteur
    await prisma.notification.create({
      data: {
        userId: gleaning.announcement.ownerId,
        type: "RESERVATION_REQUEST",
        message: `${user.name || user.email} a rejoint votre session de glanage`,
      },
    });

    return NextResponse.json(participation);
  });

// se desinscrire d'un glanage
export const DELETE = authRoute
  .body(
    z.object({
      gleaningId: z.string(),
    }),
  )
  .handler(async (req, { body, data }) => {
    const { gleaningId } = body;
    const { user } = data;

    // vzrifier que la participation existe
    const participation = await prisma.participation.findFirst({
      where: {
        userId: user.id,
        gleaningId,
      },
    });

    if (!participation) {
      throw new RouteError("Vous n'êtes pas inscrit à ce glanage", 404);
    }

    // recup le glanage pour notification
    const gleaning = await prisma.gleaning.findUnique({
      where: { id: gleaningId },
      include: {
        announcement: true,
      },
    });

    // supprimer la participation
    await prisma.participation.delete({
      where: {
        id: participation.id,
      },
    });

    // notifier l'agriculteur du désistement
    if (gleaning) {
      await prisma.notification.create({
        data: {
          userId: gleaning.announcement.ownerId,
          type: "GLEANING_CANCELLED",
          message: `${user.name || user.email} s'est désinscrit de votre session de glanage`,
        },
      });
    }

    return NextResponse.json({ success: true });
  });
