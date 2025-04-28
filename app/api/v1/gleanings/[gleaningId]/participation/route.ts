import { authRoute, RouteError } from "@/lib/safe-route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = authRoute
  .params(
    z.object({
      gleaningId: z.string(),
    }),
  )
  .handler(async (req, { params, data }) => {
    try {
      // récupérer la participation de l'utilisateur pour ce glanage
      const participation = await prisma.participation.findUnique({
        where: {
          userId_gleaningId: {
            userId: data.user.id,
            gleaningId: params.gleaningId,
          },
        },
      });

      if (!participation) {
        throw new RouteError("participation non trouvée", 404);
      }

      return NextResponse.json({
        participationId: participation.id,
        userId: participation.userId,
        gleaningId: participation.gleaningId,
      });
    } catch (error) {
      if (error instanceof RouteError) {
        throw error;
      }
      console.error(
        "erreur lors de la récupération de la participation",
        error,
      );
      throw new RouteError(
        "erreur lors de la récupération de la participation",
        500,
      );
    }
  });
