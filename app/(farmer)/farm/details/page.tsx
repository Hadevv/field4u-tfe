import { auth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";
import {
  Layout,
  LayoutHeader,
  LayoutTitle,
  LayoutDescription,
  LayoutContent,
  LayoutActions,
} from "@/features/page/layout";
import { FarmForm } from "./FarmForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function FarmDetailsPage() {
  const user = await auth();

  if (!user) return null;

  const farms = await prisma.farm.findMany({
    where: { ownerId: user.id },
  });

  const hasFarm = farms.length > 0;

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Mon exploitation</LayoutTitle>
        <LayoutDescription>
          {hasFarm
            ? "Gérez les informations de votre exploitation agricole"
            : "Créez votre exploitation agricole pour commencer à publier des annonces de glanage"}
        </LayoutDescription>
      </LayoutHeader>

      <LayoutActions>
        {hasFarm && (
          <Button asChild>
            <Link href="/farm/details/new">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une exploitation
            </Link>
          </Button>
        )}
      </LayoutActions>

      <LayoutContent>
        {hasFarm ? (
          <div className="space-y-8">
            {farms.map((farm) => (
              <div key={farm.id} className="space-y-6">
                <FarmForm farm={farm} />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border p-8">
            <h2 className="text-xl font-semibold">
              Vous n'avez pas encore créé d'exploitation
            </h2>
            <p className="mt-2 text-muted-foreground">
              Créez votre exploitation pour pouvoir ajouter des champs et
              publier des annonces de glanage.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link href="/farm/details/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer mon exploitation
                </Link>
              </Button>
            </div>
          </div>
        )}
      </LayoutContent>
    </Layout>
  );
}
