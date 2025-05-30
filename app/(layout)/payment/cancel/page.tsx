import { buttonVariants } from "@/components/ui/button";
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import Link from "next/link";
import type { PageParams } from "@/types/next";

export default async function CancelPaymentPage(props: PageParams) {
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
