/* eslint-disable @typescript-eslint/no-empty-object-type */
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContactSupportDialog } from "@/features/contact/support/ContactSupportDialog";
import { HeaderBase } from "@/features/layout/HeaderBase";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import type { PageParams } from "@/types/next";
import Link from "next/link";
import { getError } from "./auth-error-mapping";

export default async function AuthErrorPage(props: PageParams<{}>) {
  const { errorMessage, error } = getError((await props.searchParams).error);

  return (
    <div className="flex h-full flex-col">
      <HeaderBase isAuthenticated={false} />
      <Layout>
        <LayoutHeader>
          <LayoutTitle>Erreur d'authentification</LayoutTitle>
        </LayoutHeader>
        <LayoutContent>
          <Card variant="error">
            <CardHeader>
              <CardDescription>{error}</CardDescription>
              <CardTitle>{errorMessage}</CardTitle>
            </CardHeader>
            <CardFooter className="flex items-center gap-2">
              <Link href="/" className={buttonVariants({ size: "sm" })}>
                Accueil
              </Link>
              <ContactSupportDialog />
            </CardFooter>
          </Card>
        </LayoutContent>
      </Layout>
    </div>
  );
}
