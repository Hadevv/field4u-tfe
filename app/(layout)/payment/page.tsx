import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/lib/auth/helper";
import type { PageParams } from "@/types/next";
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { Card, CardContent } from "@/components/ui/card";
import { StripePaymentClient } from "./_components/StripePaymentClient";

export default async function PaymentPage(props: PageParams) {
  const searchParams = await props.searchParams;
  const user = await auth();

  if (!user) {
    redirect("/auth/login");
  }

  const paymentIntent = searchParams.payment_intent;

  if (!paymentIntent) {
    redirect("/");
  }

  const clientSecret = Array.isArray(paymentIntent)
    ? paymentIntent[0]
    : paymentIntent;

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>paiement sécurisé</LayoutTitle>
        <LayoutDescription>
          veuillez compléter les informations de paiement ci-dessous pour
          finaliser votre transaction
        </LayoutDescription>
      </LayoutHeader>
      <LayoutContent>
        <Card className="w-full max-w-xl mx-auto">
          <CardContent className="p-6">
            <Suspense
              fallback={
                <div className="h-64 animate-pulse bg-muted rounded-lg" />
              }
            >
              <StripePaymentClient clientSecret={clientSecret} />
            </Suspense>
          </CardContent>
        </Card>
      </LayoutContent>
    </Layout>
  );
}
