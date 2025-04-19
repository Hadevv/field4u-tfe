import { SiteConfig } from "@/site-config";
import { Link, Preview, Section, Text } from "@react-email/components";
import { EmailLayout } from "./utils/EmailLayout";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function GleaningReminderEmail({
  announcementTitle,
  date,
  gleaningLink,
}: {
  announcementTitle: string;
  date: Date;
  gleaningLink: string;
}) {
  const formattedDate = format(new Date(date), "EEEE d MMMM à HH'h'mm", {
    locale: fr,
  });

  return (
    <EmailLayout>
      <Preview>rappel pour le glanage "{announcementTitle}" demain</Preview>
      <Section className="my-6">
        <Text className="text-lg leading-6">
          nous sommes ravis de vous rappeler votre participation au glanage "
          {announcementTitle}" prévu pour {formattedDate}.
        </Text>
        <Text>
          n'oubliez pas d'apporter tout le matériel nécessaire pour votre
          glanage.
        </Text>
        <Text className="text-lg leading-6">
          <Link className="text-sky-500 hover:underline" href={gleaningLink}>
            👉 voir les détails du glanage 👈
          </Link>
        </Text>
      </Section>
      <Text className="text-lg leading-6">
        à bientôt,
        <br />
        {SiteConfig.title}
      </Text>
    </EmailLayout>
  );
}
