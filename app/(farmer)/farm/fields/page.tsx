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
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { FieldsList } from "./FieldsList";
import { FieldsListSkeleton } from "./FieldsListSkeleton";

export default async function FieldsPage() {
  const user = await auth();

  if (!user) return null;

  const farm = await prisma.farm.findFirst({
    where: { ownerId: user.id },
    select: { id: true },
  });

  const hasFarm = !!farm;

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Mes champs</LayoutTitle>
        <LayoutDescription>
          Gérez vos champs agricoles disponibles pour le glanage
        </LayoutDescription>
      </LayoutHeader>

      <LayoutActions>
        {hasFarm ? (
          <Button asChild size="sm">
            <Link href="/farm/fields/new">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un champ
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" size="sm">
            <Link href="/farm/details">
              <Plus className="mr-2 h-4 w-4" />
              Créer d'abord une exploitation
            </Link>
          </Button>
        )}
      </LayoutActions>

      <LayoutContent>
        {hasFarm ? (
          <Suspense fallback={<FieldsListSkeleton />}>
            <FieldsList userId={user.id} farmId={farm.id} />
          </Suspense>
        ) : (
          <div className="rounded-lg border p-8">
            <h2 className="text-xl font-semibold">
              Créez d'abord une exploitation
            </h2>
            <p className="mt-2 text-muted-foreground">
              Vous devez créer une exploitation avant de pouvoir ajouter des
              champs.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link href="/farm/details">
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
