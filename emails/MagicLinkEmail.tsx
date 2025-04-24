import { SiteConfig } from "@/site-config";
import { Link, Preview, Section, Text } from "@react-email/components";
import { EmailLayout } from "./utils/EmailLayout";

export default function MagicLinkMail({ url }: { url: string }) {
  return (
    <EmailLayout>
      <Preview>
        Vous avez demandé un lien magique pour vous connecter à votre compte.
      </Preview>
      <Section className="my-6">
        <Text className="text-lg leading-6">
          <Link className="text-sky-500 hover:underline" href={url}>
            👉 Cliquez ici pour vous connecter 👈
          </Link>
        </Text>
        <Text className="text-lg leading-6">
          Si vous n'avez pas demandé ce lien, veuillez ignorer cet email.
        </Text>
      </Section>
      <Text className="text-lg leading-6">
        A très bientôt,
        <br />
        {SiteConfig.title}
      </Text>
    </EmailLayout>
  );
}
