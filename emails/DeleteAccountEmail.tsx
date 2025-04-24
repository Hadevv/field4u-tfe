import { SiteConfig } from "@/site-config";
import { Link, Section, Text } from "@react-email/components";
import { EmailLayout } from "./utils/EmailLayout";

export default function DeleteAccountEmail({ email }: { email: string }) {
  return (
    <EmailLayout>
      <Section className="my-6">
        <Text className="text-lg leading-6">Hello,</Text>
        <Text className="text-lg leading-6">
          votre compte avec l'email{" "}
          <Link
            className="text-sky-500 hover:underline"
            href={`mailto:${email}`}
          >
            {email}
          </Link>{" "}
          a été supprimé.
        </Text>
        <Text className="text-lg leading-6">
          cette action est irréversible.
        </Text>
        <Text className="text-lg leading-6">
          si vous avez des questions, veuillez nous contacter à{" "}
          {SiteConfig.email.contact}.
        </Text>
      </Section>
      <Text className="text-lg leading-6">
        a très bientôt,
        <br />
        {SiteConfig.title}
      </Text>
    </EmailLayout>
  );
}
