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

export default async function SuccessPaymentPage(props: PageParams) {
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
