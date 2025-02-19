import { Header } from "@/features/layout/Header";
import { Layout, LayoutContent } from "@/features/page/layout";
import type { PageParams } from "@/types/next";
import { redirect } from "next/navigation";
import { requiredAuth } from "@/lib/auth/helper";
import { logger } from "@/lib/logger";
import OnboardingForm from "@/features/onboarding/OnboardingForm";

/**
 * This page is shown when a user logs in. You can add an onboarding process here.
 */
export default async function OnboardingPage(props: PageParams) {
  const searchParams = await props.searchParams;
  const callbackUrl =
    typeof searchParams.callbackUrl === "string"
      ? searchParams.callbackUrl
      : "/";

  const user = await requiredAuth();

  console.log("User", user);

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
