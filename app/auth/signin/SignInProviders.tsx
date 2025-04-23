"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Divider } from "@/components/ui/divider";
import { Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { AccountLinkingInfo } from "./AccountLinkingInfo";
import { MagicLinkForm } from "./MagicLinkForm";
import { ProviderButton } from "./ProviderButton";
import { SignInCredentialsAndMagicLinkForm } from "./SignInCredentialsAndMagicLinkForm";

export const SignInProviders = () => {
  const { data: providers, isPending } = useQuery({
    queryFn: () => fetch(`/api/auth/providers`).then((res) => res.json()),
    queryKey: ["providers"],
  });

  if (isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-9" />
        <Divider>or</Divider>
        <Skeleton className="h-11" />
      </div>
    );
  }

  if (typeof providers !== "object") {
    return (
      <Alert>
        <AlertTriangle size={16} />
        <AlertTitle>
          Le provider n'est pas disponible. Cela est dû à une mauvaise
          configuration dans le fichier
          <Typography variant="code">auth.ts</Typography> .
        </AlertTitle>
        <AlertDescription>
          Veuillez consulter{" "}
          <Typography variant="link" as={Link} href="">
            la documentation
          </Typography>{" "}
          pour résoudre le problème.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <AccountLinkingInfo />

      {providers.resend && !providers.credentials ? (
        <>
          <Typography variant="small">Magic link ✨</Typography>
          <MagicLinkForm />
          <Divider>or</Divider>
        </>
      ) : null}

      {providers.credentials ? (
        <>
          <SignInCredentialsAndMagicLinkForm />
          <Divider>or</Divider>
        </>
      ) : null}

      <div className="flex flex-col gap-2">
        {providers.github ? <ProviderButton providerId="github" /> : null}
        {providers.google ? <ProviderButton providerId="google" /> : null}
      </div>

      {providers.credentials ? (
        <Typography variant="small">
          Vous n'avez pas de compte ?{" "}
          <Typography variant="link" as={Link} href="/auth/signup">
            Créer un compte
          </Typography>
        </Typography>
      ) : null}
    </div>
  );
};
