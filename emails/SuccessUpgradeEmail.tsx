import { SiteConfig } from "@/site-config";
import { Preview, Section, Text } from "@react-email/components";
import { EmailLayout } from "./utils/EmailLayout";

export default function SuccessUpgradeEmail() {
  return (
    <EmailLayout>
      <Preview>Votre compte ${SiteConfig.title} a été mise à jour</Preview>
      <Section className="my-6">
        <Text className="text-lg leading-6">Bonjour,</Text>
        <Text className="text-lg leading-6">
          Bonnes nouvelles ! Votre paiement a abouti, et vous avez maintenant
          accès à toutes nos fonctionnalités premium. Prêt à explorer tout ce
          que nous offrons !
        </Text>
        <Text className="text-lg leading-6">
          Si vous avez des questions ou besoin d'assistance, n'hésitez pas à
          nous contacter. Nous sommes là pour vous aider à tirer le meilleur
          parti de votre expérience.
        </Text>
        <Text className="text-lg leading-6">Bon exploration,</Text>
      </Section>
      <Text className="text-lg leading-6">
        A très bientôt,
        <br />
        {SiteConfig.title}
      </Text>
    </EmailLayout>
  );
}
