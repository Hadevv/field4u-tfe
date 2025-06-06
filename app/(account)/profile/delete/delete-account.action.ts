"use server";

import { ActionError, authAction } from "@/lib/backend/safe-actions";
import { sendEmail } from "@/lib/mail/sendEmail";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { SiteConfig } from "@/site-config";
import DeleteAccountEmail from "../../../../emails/DeleteAccountEmail";

export const deleteAccountAction = authAction.action(async ({ ctx }) => {
  const userId = ctx.user.id;

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ActionError("Vous n'avez pas de compte!");
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  if (user.stripeCustomerId) {
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
    });

    for (const subscription of subscriptions.data) {
      await stripe.subscriptions.cancel(subscription.id);
    }

    await stripe.customers.del(user.stripeCustomerId);
  }

  await sendEmail({
    from: SiteConfig.email.from,
    subject: "Votre compte a été supprimé",
    to: user.email,
    react: DeleteAccountEmail({
      email: user.email,
    }),
  });
});
