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
import { AnnouncementsList } from "./AnnouncementsList";
import { AnnouncementsListSkeleton } from "./AnnouncementsListSkeleton";

export default async function AnnouncementsPage() {
  const user = await auth();

  if (!user) return null;

  const fields = await prisma.field.count({
    where: {
      OR: [{ ownerId: user.id }, { farm: { ownerId: user.id } }],
    },
  });

  const hasFields = fields > 0;

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Mes annonces</LayoutTitle>
        <LayoutDescription>
          Gérez vos annonces de glanage et suivez leur activité
        </LayoutDescription>
      </LayoutHeader>

      <LayoutActions>
        {hasFields ? (
          <Button asChild className="bg-primary">
            <Link href="/farm/announcements/new">
              <Plus className="mr-2 h-4 w-4" />
              Créer une annonce
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link href="/farm/fields/new">
              <Plus className="mr-2 h-4 w-4" />
              Créer d'abord un champ
            </Link>
          </Button>
        )}
      </LayoutActions>

      <LayoutContent>
        {hasFields ? (
          <Suspense fallback={<AnnouncementsListSkeleton />}>
            <AnnouncementsList userId={user.id} />
          </Suspense>
        ) : (
          <div className="rounded-lg border p-8">
            <h2 className="text-xl font-semibold">Créez d'abord un champ</h2>
            <p className="mt-2 text-muted-foreground">
              Vous devez créer un champ avant de pouvoir publier des annonces de
              glanage.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link href="/farm/fields/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Créer un champ
                </Link>
              </Button>
            </div>
          </div>
        )}
      </LayoutContent>
    </Layout>
  );
}
