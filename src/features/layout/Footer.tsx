import { Logo } from "@/components/svg/Logo";
import { Typography } from "@/components/ui/typography";
import { Layout, LayoutContent } from "@/features/page/layout";
import { SiteConfig } from "@/site-config";
import { ContactSupportLink } from "@/features/contact/support";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-card border-t">
      <Layout className="mx-auto max-w-6xl py-12">
        <LayoutContent className="flex justify-between max-lg:flex-col max-lg:gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Logo />
            </div>
            <Typography variant="muted" className="max-w-md">
              Plateforme de glanage connectant agriculteurs et glaneurs
            </Typography>
            <Typography variant="muted" className="text-sm">
              © {new Date().getFullYear()} {SiteConfig.company.name} - Tous
              droits réservés
            </Typography>
          </div>

          <div className="flex flex-col items-start gap-4 max-lg:items-start">
            <Typography variant="large">Navigation</Typography>
            <Typography
              as={Link}
              variant="muted"
              className="hover:text-primary transition-colors hover:underline"
              href="/announcements/"
            >
              Explorer la carte
            </Typography>
            <Typography
              as={Link}
              variant="muted"
              className="hover:text-primary transition-colors hover:underline"
              href="/my-gleanings/"
            >
              Mes glanages
            </Typography>
            <ContactSupportLink className="text-sm text-muted-foreground hover:text-primary transition-colors hover:underline cursor-pointer">
              Contact
            </ContactSupportLink>
          </div>

          <div className="flex flex-col items-start gap-4 max-lg:items-start">
            <Typography variant="large">Mentions légales</Typography>
            <Typography
              as={Link}
              variant="muted"
              className="hover:text-primary transition-colors hover:underline"
              href="/legal/terms"
            >
              Conditions d'utilisation
            </Typography>
            <Typography
              as={Link}
              variant="muted"
              className="hover:text-primary transition-colors hover:underline"
              href="/legal/privacy"
            >
              Politique de confidentialité
            </Typography>
          </div>
        </LayoutContent>
      </Layout>
    </footer>
  );
};
