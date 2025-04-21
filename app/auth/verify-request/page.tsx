import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Typography } from "@/components/ui/typography";
import { auth } from "@/lib/auth/helper";
import { redirect } from "next/navigation";
import type { PageParams } from "@/types/next";
import { NameForm } from "./_components/NameForm";
import { logger } from "@/lib/logger";
import { HeaderSimple } from "@/features/layout/HeaderSimple";

export default async function VerifyRequestPage(props: PageParams) {
  const searchParams = await props.searchParams;
  const email = searchParams.email || "";
  const user = await auth();
  logger.info("VerifyRequestPage - User:", {
    authenticated: !!user,
    hasName: !!user?.name,
    email: user?.email || email,
  });

  if (user && !user.name) {
    return (
      <>
        <HeaderSimple />
        <div className="container flex min-h-[calc(100vh-80px)] flex-col items-center justify-center py-8">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>encore une dernière chose !</CardTitle>
              <CardDescription>
                veuillez choisir un nom qui sera affiché publiquement dans notre
                application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NameForm
                email={user.email}
                redirectUrl={
                  user.onboardingCompleted ? "/" : "/auth/onboarding"
                }
              />
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  if (user) {
    if (!user.onboardingCompleted) {
      logger.info("User authenticated with name, redirecting to onboarding");
      redirect("/auth/onboarding");
    } else {
      logger.info("User fully onboarded, redirecting to home");
      redirect("/");
    }
  }

  return (
    <>
      <HeaderSimple />
      <div className="container flex min-h-[calc(100vh-80px)] flex-col items-center justify-center py-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>presque terminé !</CardTitle>
            <CardDescription>
              nous avons envoyé un email à{" "}
              {email ? <strong>{email}</strong> : "votre adresse email"}
              avec un lien magique pour vous connecter.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Typography>
              vérifiez votre boîte de réception (et vos spams si nécessaire) et
              cliquez sur le lien pour terminer votre connexion.
            </Typography>
            <Typography className="mt-4 text-sm text-muted-foreground">
              après la connexion, vous pourrez choisir votre nom public et
              compléter votre profil.
            </Typography>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
