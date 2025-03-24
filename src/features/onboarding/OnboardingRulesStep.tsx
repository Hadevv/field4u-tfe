"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { acceptRulesAction } from "../../../app/auth/onboarding/onboarding.action";
import { UserRole } from "@prisma/client";

type OnboardingRulesStepProps = {
  role: UserRole;
};

export function OnboardingRulesStep({ role }: OnboardingRulesStepProps) {
  const [accepted, setAccepted] = useState(false);
  const router = useRouter();

  const handleAccept = async () => {
    try {
      await acceptRulesAction();
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
        {/* règles pour les fermiers */}
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
        {/* règles pour les glaneurs */}
      </>
    );

  return (
    <div className="space-y-4">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Voir les règles du glanage</Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:hidden">
          <div className="overflow-y-auto">
            <DialogHeader className="contents space-y-0 text-left">
              <DialogTitle className="px-6 pt-6 text-base">
                Règles du glanage
              </DialogTitle>
              <DialogDescription asChild>
                <div className="p-6">
                  <div className="space-y-4 [&_strong]:font-semibold [&_strong]:text-foreground">
                    {rules}
                  </div>
                </div>
              </DialogDescription>
            </DialogHeader>
          </div>
          <DialogFooter className="border-t px-6 py-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="button" onClick={() => setAccepted(true)}>
                Accepter
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {accepted && (
        <Button onClick={handleAccept} className="w-full">
          Finaliser l'onboarding
        </Button>
      )}
    </div>
  );
}
