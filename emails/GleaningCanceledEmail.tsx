import { SiteConfig } from "@/site-config";
import { Link, Preview, Section, Text } from "@react-email/components";
import { EmailLayout } from "./utils/EmailLayout";

export default function GleaningCanceledEmail({
  announcementTitle,
  homeLink,
}: {
  announcementTitle: string;
  homeLink: string;
}) {
  return (
    <EmailLayout>
      <Preview>annulation du glanage "{announcementTitle}"</Preview>
      <Section className="my-6">
        <Text className="text-lg leading-6">
          nous sommes désolés de vous informer que le glanage "
          {announcementTitle}" a été annulé.
        </Text>
        <Text>
          cette annulation peut être due à diverses raisons (météo,
          indisponibilité du champ, etc.). nous vous invitons à consulter
          d'autres opportunités de glanage sur notre plateforme.
        </Text>
        <Text className="text-lg leading-6">
          <Link className="text-sky-500 hover:underline" href={homeLink}>
            👉 explorer d'autres opportunités de glanage 👈
          </Link>
        </Text>
      </Section>
      <Text className="text-lg leading-6">
        à bientôt pour de nouvelles aventures de glanage,
        <br />
        {SiteConfig.title}
      </Text>
    </EmailLayout>
  );
}
