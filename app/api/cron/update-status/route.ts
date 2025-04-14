import { prisma } from "@/lib/prisma";
import { GleaningStatus } from "@prisma/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    // vérifier le secret api
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    // vérifier que le secret
    if (!secret || secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: "non autorisé" }, { status: 401 });
    }

    // requete pour obtenir tous les glanages avec leurs annonces associées
    const gleanings = await prisma.gleaning.findMany({
      where: {
        status: {
          notIn: ["CANCELLED"],
        },
      },
      include: {
        announcement: true,
      },
    });

    // compteur de mises à jour
    let updatedCount = 0;

    const now = new Date();
    const updatePromises = gleanings.map(async (gleaning) => {
      if (!gleaning.announcement.startDate || !gleaning.announcement.endDate) {
        return;
      }

      // determiner le nouveau statut
      let newStatus: GleaningStatus | null = null;

      if (now < gleaning.announcement.startDate) {
        newStatus = "NOT_STARTED";
      } else if (
        now >= gleaning.announcement.startDate &&
        now <= gleaning.announcement.endDate
      ) {
        newStatus = "IN_PROGRESS";
      } else if (now > gleaning.announcement.endDate) {
        newStatus = "COMPLETED";
      }

      // mettre à jour si le statut a changé
      if (newStatus && newStatus !== gleaning.status) {
        await prisma.gleaning.update({
          where: { id: gleaning.id },
          data: { status: newStatus },
        });
        updatedCount++;
      }
    });

    // attendre que toutes les mises à jour soient terminées
    await Promise.all(updatePromises);

    return NextResponse.json({
      success: true,
      message: `${updatedCount} glanages mis à jour`,
    });
  } catch (error) {
    console.error("erreur lors de la mise à jour des statuts :", error);
    return NextResponse.json(
      { error: "erreur lors de la mise à jour des statuts" },
      { status: 500 },
    );
  }
}
