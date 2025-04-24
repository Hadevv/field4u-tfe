import { buttonVariants } from "@/components/ui/button";
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import Link from "next/link";

export default function SuccessPaymentPage() {
  return (
    <>
      <Layout>
        <LayoutHeader>
          <LayoutTitle>Merci pour votre achat!</LayoutTitle>
          <LayoutDescription>
            Votre paiement a été effectué avec succès! Vous avez maintenant
            accès à tous nos ressources premium. Si vous avez des questions,
            nous sommes là pour vous aider.
          </LayoutDescription>
        </LayoutHeader>
        <LayoutContent>
          <Link href="/" className={buttonVariants({ size: "lg" })}>
            Commencer
          </Link>
        </LayoutContent>
      </Layout>
    </>
  );
}
