import { ContactSupportDialog } from "@/features/contact/support/ContactSupportDialog";
import Link from "next/link";
import { buttonVariants } from "../../components/ui/button";
import { Typography } from "../../components/ui/typography";

export function Page400() {
  return (
    <main className="flex flex-col items-center gap-8">
      <div className="max-w-lg space-y-3 text-center">
        <Typography variant="code">400</Typography>
        <Typography variant="h1">Oh non! Erreur inattendue.</Typography>
        <Typography>
          Il semble que nous rencontrons des difficultés techniques. Ne vous
          inquiétez pas, notre équipe travaille dessus. Dans le même temps,
          essayez de rafraîchir la page ou de revenir plus tard.
        </Typography>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Retour à l'accueil
        </Link>
        <ContactSupportDialog />
      </div>
    </main>
  );
}
