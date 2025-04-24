import { SiteConfig } from "@/site-config";
import { Link, Preview, Section, Text } from "@react-email/components";
import { EmailLayout } from "./utils/EmailLayout";

export default function VerifyEmail({ url }: { url: string }) {
  return (
    <EmailLayout>
      <Preview>
        Veuillez cliquer sur le lien ci-dessous pour vous connecter à votre
        compte.
      </Preview>
      <Section className="my-6">
        <Text className="text-lg leading-6">
          Vous avez demandé à vérifier votre adresse email pour votre compte à{" "}
          {SiteConfig.title}.
        </Text>
        <Text>
          Si vous n'avez pas demandé cette vérification, veuillez ignorer cet
          email.
        </Text>
        <Text className="text-lg leading-6">
          <Link className="text-sky-500 hover:underline" href={url}>
            👉 Cliquez ici pour vérifier votre email 👈
          </Link>
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
