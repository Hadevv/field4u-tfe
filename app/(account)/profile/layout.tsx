/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { LayoutParams } from "@/types/next";
import { VerifyEmailButton } from "./verify-email/VerifyEmailButton";
import { requiredAuth, isAdmin } from "@/lib/auth/helper";

export default async function RouteLayout(props: LayoutParams<{}>) {
  const user = await requiredAuth();

  const isEmailNotVerified = user.email && !user.emailVerified;

  return (
    <>
      {isEmailNotVerified ? (
        <Alert className="mb-4">
          <AlertTitle>Email not verified</AlertTitle>
          <AlertDescription>
            Please verify your email to access your account.
          </AlertDescription>
          <VerifyEmailButton />
        </Alert>
      ) : null}
      {props.children}
    </>
  );
}
