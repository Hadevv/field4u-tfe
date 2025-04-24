import { getServerUrl } from "@/lib/server-url";
import { SiteConfig } from "@/site-config";
import { Preview, Section, Text } from "@react-email/components";
import Link from "next/link";
import { EmailLayout } from "./utils/EmailLayout";

export default function SubscribtionDowngradeEmail() {
  return (
    <EmailLayout>
      <Preview>Votre accès premium a été suspendu</Preview>
      <Section className="my-6">
        <Text className="text-lg leading-6">Bonjour,</Text>
        <Text className="text-lg leading-6">
          Nous vous informons que votre compte a été réduit à notre niveau
          d'accès de base. Cette modification est due aux problèmes récents avec
          votre paiement de l'abonnement premium.
        </Text>
        <Text className="text-lg leading-6">
          Alors que vous continuerez à profiter de nos services de base, l'accès
          aux fonctionnalités premium est maintenant limité. Nous aimerions vous
          revoir dans notre communauté premium !
        </Text>
        <Text className="text-lg leading-6">
          Pour réactiver votre statut premium, veuillez mettre à jour vos
          informations ici :
        </Text>
        <Text className="text-lg leading-6">
          <Link
            className="text-sky-500 hover:underline"
            href={`${getServerUrl()}/profile/billing`}
          >
            Cliquez ici pour mettre à jour votre paiement et continuer à
            utiliser ${SiteConfig.title}
          </Link>
        </Text>
        <Text className="text-lg leading-6">
          Si vous avez des questions ou besoin d'assistance, notre équipe est là
          pour vous aider.
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
