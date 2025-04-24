import { Header } from "@/features/layout/Header";
import { Layout, LayoutContent } from "@/features/page/layout";
import type { PageParams } from "@/types/next";
import { redirect } from "next/navigation";
import { requiredAuth } from "@/lib/auth/helper";
import { logger } from "@/lib/logger";
import OnboardingForm from "./_components/OnboardingForm";

export default async function OnboardingPage(props: PageParams) {
  const searchParams = await props.searchParams;
  const callbackUrl =
    typeof searchParams.callbackUrl === "string"
      ? searchParams.callbackUrl
      : "/";

  const user = await requiredAuth();

  if (!user.name) {
    logger.info("User has no name, redirecting to name definition");
    redirect(`/auth/verify-request?email=${encodeURIComponent(user.email)}`);
  }

  if (user?.onboardingCompleted === true) {
    logger.info("User has completed onboarding");
    redirect(callbackUrl);
  } else {
    logger.info("User has not completed onboarding");
  }

  return (
    <>
      <Header />
      <Layout>
        <LayoutContent>
          <OnboardingForm />
        </LayoutContent>
      </Layout>
    </>
  );
}
