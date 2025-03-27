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
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to accept rules");
    }
  };

  const rules =
    role === "FARMER" ? (
      <>
        <p>
          <strong>Règle 1 pour les fermiers</strong>: Description de la règle 1
          pour les fermiers.
        </p>
        <p>
          <strong>Règle 2 pour les fermiers</strong>: Description de la règle 2
          pour les fermiers.
        </p>
      </>
    ) : (
      <>
        <p>
          <strong>Règle 1 pour les glaneurs</strong>: Description de la règle 1
          pour les glaneurs.
        </p>
        <p>
          <strong>Règle 2 pour les glaneurs</strong>: Description de la règle 2
          pour les glaneurs.
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
