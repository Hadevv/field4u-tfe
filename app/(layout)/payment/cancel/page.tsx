import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { ContactSupportDialog } from "@/features/contact/support/ContactSupportDialog";
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import Link from "next/link";

export default function CancelPaymentPage() {
  return (
    <Layout>
      <LayoutHeader>
        <Badge variant="outline">Paiement annulé</Badge>
        <LayoutTitle>
          Nous sommes désolés, mais nous n'avons pas pu traiter votre paiement
        </LayoutTitle>
        <LayoutDescription>
          Nous avons rencontré un problème lors du traitement de votre paiement.
          <br /> Veuillez vérifier vos coordonnées de paiement et réessayer.
          <br /> Si le problème persiste, n'hésitez pas à nous contacter pour
          une assistance.
          <br /> Nous sommes là pour vous aider à résoudre ce problème de
          manière fluide.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutContent className="flex items-center gap-2">
        <Link href="/" className={buttonVariants({ variant: "secondary" })}>
          Retour à l'accueil
        </Link>
        <ContactSupportDialog />
      </LayoutContent>
    </Layout>
  );
}
