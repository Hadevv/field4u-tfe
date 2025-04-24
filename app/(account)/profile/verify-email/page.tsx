/* eslint-disable @typescript-eslint/no-empty-object-type */
import { buttonVariants } from "@/components/ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import type { PageParams } from "@/types/next";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function RoutePage(props: PageParams<{}>) {
  const tokenParam = (await props.searchParams).token;
  const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;

  const success = (await props.searchParams).success === "true";

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Email vérifié</CardTitle>
        </CardHeader>
        <CardFooter>
          <Link className={buttonVariants()} href="/profile">
            Compte
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (!token) {
    return (
      <Card variant="error">
        <CardHeader>
          <CardTitle>Token invalide</CardTitle>
        </CardHeader>
        <CardFooter>
          <Link className={buttonVariants()} href="/profile">
            Compte
          </Link>
        </CardFooter>
      </Card>
    );
  }

  const verificationToken = await prisma.verificationToken.findUnique({
    where: {
      token,
    },
  });

  const email = verificationToken?.identifier;

  if (!email) {
    return (
      <Card variant="error">
        <CardHeader>
          <CardTitle>Token invalide</CardTitle>
        </CardHeader>
        <CardFooter>
          <Link className={buttonVariants()} href="/profile">
            Compte
          </Link>
        </CardFooter>
      </Card>
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return (
      <Card variant="error">
        <CardHeader>
          <CardTitle>Utilisateur non trouvé</CardTitle>
        </CardHeader>
        <CardFooter>
          <Link className={buttonVariants()} href="/profile">
            Compte
          </Link>
        </CardFooter>
      </Card>
    );
  }

  if (user.emailVerified) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Email vérifié.</CardTitle>
        </CardHeader>
        <CardFooter>
          <Link className={buttonVariants()} href="/profile">
            Compte
          </Link>
        </CardFooter>
      </Card>
    );
  }

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  await prisma.verificationToken.delete({
    where: {
      token,
    },
  });

  redirect("/profile/verify-email?success=true");
}
