"use server";

import { authRoute, RouteError } from "@/lib/safe-route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

// TODO supprimer passé par le webhook stripe
const UpdateStatusSchema = z.object({
  paymentIntentId: z.string(),
  status: z.string(),
});

export const POST = authRoute
  .body(UpdateStatusSchema)
  .handler(async (req, { body, data }) => {
    try {
      const payment = await prisma.participationPayment.findFirst({
        where: { paymentIntentId: body.paymentIntentId },
        include: {
          participation: true,
        },
      });

      if (!payment) {
        throw new RouteError("paiement non trouvé", 404);
      }

      if (payment.participation.userId !== data.user.id) {
        throw new RouteError("non autorisé", 403);
      }

      if (payment.status !== body.status) {
        await prisma.participationPayment.update({
          where: { id: payment.id },
          data: { status: body.status },
        });
      }

      return NextResponse.json({
        success: true,
        message: `statut mis à jour: ${body.status}`,
        paymentId: payment.id,
      });
    } catch (error) {
      if (error instanceof RouteError) {
        throw error;
      }
      console.error("erreur lors de la mise à jour du statut", error);
      throw new RouteError("erreur lors de la mise à jour du statut", 500);
    }
  });
