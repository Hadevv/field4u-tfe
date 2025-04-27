import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { stripe } from "@/lib/stripe";
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
