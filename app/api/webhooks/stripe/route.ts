import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { findUserFromCustomer } from "./findUserFromCustomer";
import {
  downgradeUserFromPlan,
  getPlanFromLineItem,
  notifyUserOfPaymentFailure,
  notifyUserOfPremiumDowngrade,
  notifyUserOfPremiumUpgrade,
  upgradeUserToPlan,
} from "./premium.helper";
import { sendNotificationToUser } from "@/lib/notifications/sendNotification";
import { NotificationType } from "@prisma/client";

/**
 * stripe webhooks
 * @docs
 * - https://stripe.com/docs/webhooks
 * - https://stripe.com/docs/api/events/types
 */
export const POST = async (req: NextRequest) => {
  const body = await req.text();
  const headerList = headers();
  const stripeSignature = (await headerList).get("stripe-signature") || "";

  let event: Stripe.Event | null = null;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      stripeSignature,
      env.STRIPE_WEBHOOK_SECRET ?? "",
    );
  } catch (error) {
    logger.error("signature stripe invalide", error);
    return NextResponse.json({ error: "signature invalide" }, { status: 400 });
  }

  logger.info(`webhook reçu: ${event.type}`, { id: event.id });

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(event.data.object);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentIntentFailed(event.data.object);
        break;
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;
      case "invoice.paid":
        await handleInvoicePaid(event.data.object);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object);
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error(`erreur webhook: ${event.type}`, error);
    return NextResponse.json({ error: "erreur serveur" }, { status: 500 });
  }
};

// gestion des paiements de participation sécurisée
async function handlePaymentIntentSucceeded(object: Stripe.PaymentIntent) {
  const paymentIntentId = object.id;

  logger.info(`paiement réussi via webhook`, { paymentIntentId });

  const payment = await prisma.participationPayment.findFirst({
    where: { paymentIntentId },
    include: {
      participation: {
        select: {
          userId: true,
          gleaning: {
            select: {
              announcement: {
                select: { title: true },
              },
            },
          },
        },
      },
    },
  });

  if (!payment) {
    logger.error(`paiement introuvable via webhook`, { paymentIntentId });
    return;
  }

  if (payment.status !== object.status) {
    await prisma.participationPayment.update({
      where: { id: payment.id },
      data: { status: object.status },
    });

    logger.info(`statut mis à jour via webhook`, {
      id: payment.id,
      old_status: payment.status,
      new_status: object.status,
    });

    if (payment.participation.userId) {
      const announcementTitle =
        payment.participation.gleaning?.announcement?.title || "glanage";
      await sendNotificationToUser(
        payment.participation.userId,
        NotificationType.PAYMENT_RECEIVED,
        `votre paiement pour "${announcementTitle}" a été reçu avec succès`,
      );
    }
  }
}

async function handlePaymentIntentFailed(object: Stripe.PaymentIntent) {
  const paymentIntentId = object.id;

  logger.info(`paiement échoué via webhook`, { paymentIntentId });

  const payment = await prisma.participationPayment.findFirst({
    where: { paymentIntentId },
  });

  if (!payment) {
    logger.error(`paiement introuvable via webhook`, { paymentIntentId });
    return;
  }

  if (payment.status !== object.status) {
    await prisma.participationPayment.update({
      where: { id: payment.id },
      data: { status: object.status },
    });

    logger.info(`statut d'échec mis à jour via webhook`, {
      id: payment.id,
      old_status: payment.status,
      new_status: object.status,
    });
  }
}

// gestion des webhooks d'abonnement
async function handleCheckoutSessionCompleted(object: Stripe.Checkout.Session) {
  if (!object.customer) return;
  const user = await findUserFromCustomer(object.customer);
  const lineItems = await stripe.checkout.sessions.listLineItems(object.id, {
    limit: 1,
  });
  await upgradeUserToPlan(user.id, await getPlanFromLineItem(lineItems.data));
  await notifyUserOfPremiumUpgrade(user);
}

async function handleInvoicePaid(object: Stripe.Invoice) {
  if (!object.customer) return;
  const user = await findUserFromCustomer(object.customer);
  if (user.plan !== "FREE") return;
  await upgradeUserToPlan(
    user.id,
    await getPlanFromLineItem(object.lines.data),
  );
}

async function handleInvoicePaymentFailed(object: Stripe.Invoice) {
  if (!object.customer) return;
  const user = await findUserFromCustomer(object.customer);
  await downgradeUserFromPlan(user.id);
  await notifyUserOfPaymentFailure(user);
}

async function handleSubscriptionDeleted(object: Stripe.Subscription) {
  if (!object.customer) return;
  const user = await findUserFromCustomer(object.customer);
  await downgradeUserFromPlan(user.id);
  await notifyUserOfPremiumDowngrade(user);
}

async function handleSubscriptionUpdated(object: Stripe.Subscription) {
  if (!object.customer) return;
  const user = await findUserFromCustomer(object.customer);
  await upgradeUserToPlan(
    user.id,
    await getPlanFromLineItem(object.items.data),
  );
  await notifyUserOfPremiumUpgrade(user);
}
