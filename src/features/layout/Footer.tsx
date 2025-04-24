import { Typography } from "@/components/ui/typography";
import { Layout, LayoutContent } from "@/features/page/layout";
import { SiteConfig } from "@/site-config";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-card">
      <Layout className="mt-18 mx-auto max-w-6xl py-24">
        <LayoutContent className="flex justify-between max-lg:flex-col">
          <div className="flex flex-col gap-4">
            <div className="space-y-1">
              <Typography variant="h3">{SiteConfig.title}</Typography>
              <Typography>{SiteConfig.company.name}</Typography>
              <Typography>{SiteConfig.company.address}</Typography>
            </div>
            <Typography variant="muted" className="italic">
              © {new Date().getFullYear()} {SiteConfig.company.name} - Tous
              droits réservés.
            </Typography>
          </div>
          <div className="flex flex-col items-end gap-4">
            <Typography variant="large">Mentions légales</Typography>
            <Typography
              as={Link}
              variant="muted"
              className="hover:underline"
              href="/legal/terms"
            >
              Conditions d'utilisation
            </Typography>
            <Typography
              as={Link}
              variant="muted"
              className="hover:underline"
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
