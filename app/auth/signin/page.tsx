/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeaderBase } from "@/features/layout/HeaderBase";
import { auth } from "@/lib/auth/helper";
import type { PageParams } from "@/types/next";
import { AlertTriangle } from "lucide-react";
import { redirect } from "next/navigation";
import { getError } from "../error/auth-error-mapping";
import { SignInProviders } from "./SignInProviders";
import { Logo } from "@/components/svg/Logo";

export default async function AuthSignInPage(props: PageParams<{}>) {
  const { errorMessage, error } = getError((await props.searchParams).error);

  const user = await auth();

  if (user) {
    redirect("/profile");
  }

  return (
    <div className="flex h-full flex-col">
      <HeaderBase isAuthenticated={false} />
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-col items-center justify-center gap-2">
            <Logo />
            <CardTitle>Connectez-vous à votre compte</CardTitle>
          </CardHeader>
          <CardContent className="mt-8">
            <SignInProviders />
          </CardContent>
          {error ? (
            <Alert>
              <AlertTriangle size={16} />
              <AlertDescription>{error}</AlertDescription>
              <AlertTitle>{errorMessage}</AlertTitle>
            </Alert>
          ) : null}
        </Card>
      </div>
    </div>
  );
}
