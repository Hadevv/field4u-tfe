/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { acceptRulesAction } from "../onboarding.action";
import { UserRole } from "@prisma/client";
import { SubmitButton } from "@/features/form/SubmitButton";

type OnboardingRulesStepProps = {
  role: UserRole;
};

export function OnboardingRulesStep({ role }: OnboardingRulesStepProps) {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    try {
      await acceptRulesAction({ rulesAcceptedAt: new Date() });
      toast.success("Rules accepted successfully");
      router.push("/");
    } catch (error) {
      toast.error("Failed to accept rules");
    }
  };
  // TODO: utiliser du mdx pour les règles
  const rules =
    role === "FARMER" ? (
      <>
        <p>
          <strong>Règle 1 pour les fermiers</strong> : Respectez les engagements
          pris lors de la création du glanage (date, heure, quantité, accès au
          champ).
        </p>
        <p>
          <strong>Règle 2</strong> : Préparez un accueil minimal (consignes de
          sécurité, balisage si nécessaire).
        </p>
        <p>
          <strong>Règle 3</strong> : Signalez toute modification ou annulation
          dès que possible via la plateforme.
        </p>
        <p>
          <strong>Règle 4</strong> : Le lieu du glanage n’est affiché que 24h
          avant automatiquement pour limiter le maraudage.
        </p>
        <p>
          <strong>Règle 5</strong> : Restez courtois et respectueux envers les
          glaneurs, même en cas d’imprévus.
        </p>
      </>
    ) : (
      <>
        <p>
          <strong>Règle 1 pour les glaneurs</strong> : Inscrivez-vous uniquement
          si vous êtes certain de pouvoir venir.
        </p>
        <p>
          <strong>Règle 2</strong> : Respectez les consignes données par le
          fermier sur place.
        </p>
        <p>
          <strong>Règle 3</strong> : Soyez ponctuel et adoptez un comportement
          responsable sur le terrain.
        </p>
        <p>
          <strong>Règle 4</strong> : L’emplacement exact du champ est communiqué
          24h avant ; il est strictement interdit d’utiliser les récoltes à des
          fins commerciales.
        </p>
        <p>
          <strong>Règle 5</strong> : Laissez le champ propre après votre
          passage.
        </p>
      </>
    );

  return (
    <div className="space-y-4">
      <div className="space-y-4 [&_strong]:font-semibold [&_strong]:text-foreground">
        {rules}
      </div>
      <div className="flex items-center space-x-3">
        <SubmitButton
          variant="outline"
          onClick={() => setAccepted(true)}
          disabled={accepted}
        >
          Accepter les règles
        </SubmitButton>
      </div>
      {accepted && (
        <SubmitButton onClick={handleAccept} className="w-full">
          Finaliser l'onboarding
        </SubmitButton>
      )}
    </div>
  );
}
