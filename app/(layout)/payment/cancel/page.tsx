import { buttonVariants } from "@/components/ui/button";
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import Link from "next/link";
import type { PageParams } from "@/types/next";

async function updatePaymentStatus(paymentIntentId: string) {
  try {
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId);

    logger.info(`récupération du statut de paiement à l'annulation`, {
      paymentIntentId,
      status: intent.status,
    });

    const payment = await prisma.participationPayment.findFirst({
      where: { paymentIntentId },
    });

    if (!payment) {
      logger.error(`paiement introuvable à l'annulation`, { paymentIntentId });
      return;
    }

    if (payment.status !== intent.status) {
      await prisma.participationPayment.update({
        where: { id: payment.id },
        data: { status: intent.status },
      });

      logger.info(`statut mis à jour à l'annulation`, {
        id: payment.id,
        old_status: payment.status,
        new_status: intent.status,
      });
    } else {
      logger.info(`statut déjà à jour à l'annulation`, {
        id: payment.id,
        status: payment.status,
      });
    }
  } catch (error) {
    logger.error(`erreur de mise à jour à l'annulation`, {
      error,
      paymentIntentId,
    });
  }
}

export default async function CancelPaymentPage(props: PageParams) {
  const searchParams = await props.searchParams;
  const paymentIntentId = searchParams.payment_intent as string;

  if (paymentIntentId) {
    await updatePaymentStatus(paymentIntentId);
  }

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>paiement annulé</LayoutTitle>
        <LayoutDescription>
          votre paiement a été annulé. si vous voulez toujours participer au
          glanage, vous pouvez réessayer ou choisir un autre moyen de paiement.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutContent className="flex justify-center">
        <Link href="/my-gleanings" className={buttonVariants({ size: "lg" })}>
          retour à mes glanages
        </Link>
      </LayoutContent>
    </Layout>
  );
}
