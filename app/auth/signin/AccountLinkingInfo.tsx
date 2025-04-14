"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useSearchParams } from "next/navigation";
import { Info } from "lucide-react";

export const AccountLinkingInfo = () => {
  const searchParams = useSearchParams();
  const linkingCompleted = searchParams.get("accountLinking") === "completed";

  if (!linkingCompleted) {
    return null;
  }

  return (
    <Alert variant="default" className="mt-4">
      <Info size={16} className="mr-2" />
      <AlertTitle>comptes fusionnés</AlertTitle>
      <AlertDescription>
        nous avons automatiquement lié ce provider de connexion à votre compte
        existant. vous pouvez désormais vous connecter avec n'importe lequel des
        providers.
      </AlertDescription>
    </Alert>
  );
};
