"use server";

import { authRoute, RouteError } from "@/lib/safe-route";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { CheckoutSchema } from "./_schemas/checkout.schema";
import { logger } from "@/lib/logger";

export const POST = authRoute
  .body(CheckoutSchema)
  .handler(async (req, { body, data }) => {
    try {
      const participation = await prisma.participation.findUnique({
        where: {
          id: body.participationId,
          userId: data.user.id,
        },
        include: {
          gleaning: {
            include: {
              announcement: true,
            },
          },
        },
      });

      if (!participation) {
        throw new RouteError("participation non trouvée", 404);
      }

      const existingPayment = await prisma.participationPayment.findFirst({
        where: {
          participationId: participation.id,
          status: "succeeded",
        },
      });

      if (existingPayment) {
        throw new RouteError(
          "paiement déjà effectué pour cette participation",
          400,
        );
      }

      const pendingPayment = await prisma.participationPayment.findFirst({
        where: {
          participationId: participation.id,
          status: { not: "succeeded" },
        },
      });

      if (pendingPayment) {
        logger.info(`suppression du paiement en attente précédent`, {
          id: pendingPayment.id,
          paymentIntentId: pendingPayment.paymentIntentId,
        });

        try {
          await stripe.paymentIntents.cancel(pendingPayment.paymentIntentId);
        } catch (err) {
          logger.warn(`impossible d'annuler le paiement intent précédent`, {
            paymentIntentId: pendingPayment.paymentIntentId,
            error: err,
          });
        }

        await prisma.participationPayment.delete({
          where: { id: pendingPayment.id },
        });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(body.amount * 100),
        currency: "eur",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          participationId: participation.id,
          userId: data.user.id,
          gleaningId: participation.gleaningId,
          announcementId: participation.gleaning.announcementId,
        },
      });

      logger.info(`création d'un nouveau payment intent`, {
        paymentIntentId: paymentIntent.id,
        participationId: participation.id,
        initialStatus: paymentIntent.status,
      });

      const payment = await prisma.participationPayment.create({
        data: {
          id: nanoid(21),
          participationId: participation.id,
          amount: body.amount,
          paymentIntentId: paymentIntent.id,
          status: paymentIntent.status,
        },
      });

      logger.info(`paiement enregistré en db`, {
        id: payment.id,
        paymentIntentId: paymentIntent.id,
        status: payment.status,
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      if (error instanceof RouteError) {
        throw error;
      }
      logger.error("erreur lors de la création du payment intent", error);
      throw new RouteError("erreur lors de la création du payment", 500);
    }
  });
