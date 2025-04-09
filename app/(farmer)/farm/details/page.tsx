import { auth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";
import {
  Layout,
  LayoutHeader,
  LayoutTitle,
  LayoutDescription,
  LayoutContent,
} from "@/features/page/layout";
import { FarmForm } from "./FarmForm";
import { redirect } from "next/navigation";

export default async function FarmDetailsPage() {
  const user = await auth();

  if (!user) return null;

  const farm = await prisma.farm.findFirst({
    where: { ownerId: user.id },
  });

  if (!farm) {
    redirect("/onboarding");
  }

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Mon exploitation</LayoutTitle>
        <LayoutDescription>
          Gérez les informations de votre exploitation agricole
        </LayoutDescription>
      </LayoutHeader>

      <LayoutContent>
        <FarmForm farm={farm} />
      </LayoutContent>
    </Layout>
  );
}
