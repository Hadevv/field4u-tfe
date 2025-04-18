import { prisma } from "@/lib/prisma";
import { GleaningStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { isDateBetween, isPastDate } from "@/lib/format/date";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // verifier le secret api
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    // verifier que le secret
    if (!secret || secret !== process.env.CRON_SECRET) {
      logger.warn(
        "tentative d'accès non autorisée à la mise à jour des statuts",
      );
      return NextResponse.json({ error: "non autorisé" }, { status: 401 });
    }

    logger.info("début de la mise à jour des statuts de glanage");

    // requete pour obtenir tous les glanages avec leurs annonces associées
    const gleanings = await prisma.gleaning.findMany({
      where: {
        status: {
          notIn: ["CANCELLED"],
        },
      },
      include: {
        announcement: {
          select: {
            id: true,
            title: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    logger.info(`nombre de glanages à vérifier: ${gleanings.length}`);

    // compteur de mises à jour
    let updatedCount = 0;
    let errorCount = 0;

    const updatePromises = gleanings.map(async (gleaning) => {
      try {
        if (
          !gleaning.announcement.startDate ||
          !gleaning.announcement.endDate
        ) {
          logger.warn(
            `glanage ${gleaning.id} sans dates définis pour l'annonce ${gleaning.announcement.id}`,
          );
          return;
        }

        // determiner le nouveau statut en utilisant directement les fonctions d'utilitaire
        let newStatus: GleaningStatus;

        if (isPastDate(gleaning.announcement.endDate)) {
          newStatus = "COMPLETED";
        } else if (
          isDateBetween(
            gleaning.announcement.startDate,
            gleaning.announcement.endDate,
          )
        ) {
          newStatus = "IN_PROGRESS";
        } else {
          newStatus = "NOT_STARTED";
        }

        // mettre à jour si le statut a changé
        if (newStatus !== gleaning.status) {
          logger.info(
            `mise à jour du glanage ${gleaning.id} (${gleaning.announcement.title}): ${gleaning.status} -> ${newStatus}`,
          );

          await prisma.gleaning.update({
            where: { id: gleaning.id },
            data: { status: newStatus },
          });
          updatedCount++;
        }
      } catch (error) {
        logger.error(
          `erreur lors de la mise à jour du glanage ${gleaning.id}:`,
          error,
        );
        errorCount++;
      }
    });

    await Promise.all(updatePromises);

    logger.info(
      `mise à jour des statuts terminée: ${updatedCount} glanages mis à jour, ${errorCount} erreurs`,
    );

    return NextResponse.json({
      success: true,
      message: `${updatedCount} glanages mis à jour`,
      errors: errorCount,
    });
  } catch (error) {
    logger.error("erreur lors de la mise à jour des statuts:", error);
    return NextResponse.json(
      { error: "erreur lors de la mise à jour des statuts" },
      { status: 500 },
    );
  }
}
