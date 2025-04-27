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

    logger.info(`récupération du statut de paiement à la redirection`, {
      paymentIntentId,
      status: intent.status,
    });

    const payment = await prisma.participationPayment.findFirst({
      where: { paymentIntentId },
    });

    if (!payment) {
      logger.error(`paiement introuvable à la redirection`, {
        paymentIntentId,
      });
      return;
    }

    if (payment.status !== intent.status) {
      await prisma.participationPayment.update({
        where: { id: payment.id },
        data: { status: intent.status },
      });

      logger.info(`statut mis à jour à la redirection`, {
        id: payment.id,
        old_status: payment.status,
        new_status: intent.status,
      });
    } else {
      logger.info(`statut déjà à jour à la redirection`, {
        id: payment.id,
        status: payment.status,
      });
    }
  } catch (error) {
    logger.error(`erreur de mise à jour à la redirection`, {
      error,
      paymentIntentId,
    });
  }
}

export default async function SuccessPaymentPage(props: PageParams) {
  const searchParams = await props.searchParams;
  const paymentIntentId = searchParams.payment_intent as string;

  if (paymentIntentId) {
    await updatePaymentStatus(paymentIntentId);
  }

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>paiement réussi</LayoutTitle>
        <LayoutDescription>
          merci pour votre contribution au glanage et à l'agriculture locale.
          votre soutien fait une différence réelle pour notre communauté et nos
          agriculteurs locaux.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutContent className="flex justify-center">
        <Link href="/my-gleanings" className={buttonVariants({ size: "lg" })}>
          voir mes glanages
        </Link>
      </LayoutContent>
    </Layout>
  );
}
