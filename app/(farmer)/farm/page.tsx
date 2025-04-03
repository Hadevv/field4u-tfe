import { auth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";
import {
  Layout,
  LayoutHeader,
  LayoutTitle,
  LayoutDescription,
  LayoutContent,
} from "@/features/page/layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, MapPin, Plus, Sprout, Tractor } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default async function FarmerDashboardPage() {
  const user = await auth();

  if (!user) return null;

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Tableau de bord</LayoutTitle>
        <LayoutDescription>
          Bienvenue sur votre espace agriculteur,{" "}
          {user.name || "cher utilisateur"}. Gérez votre exploitation, vos
          champs et vos annonces de glanage.
        </LayoutDescription>
      </LayoutHeader>

      <LayoutContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Suspense fallback={<FarmCardSkeleton />}>
            <FarmCard userId={user.id} />
          </Suspense>

          <Suspense fallback={<FieldsCardSkeleton />}>
            <FieldsCard userId={user.id} />
          </Suspense>

          <Suspense fallback={<AnnouncementsCardSkeleton />}>
            <AnnouncementsCard userId={user.id} />
          </Suspense>
        </div>

        <div className="mt-8">
          <h2 className="mb-4 text-2xl font-semibold">Actions rapides</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg font-medium">
                  <Tractor className="mr-2 h-5 w-5 text-green-600" />
                  Exploitation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link href="/farm/details">
                      <Tractor className="mr-2 h-4 w-4" />
                      Gérer mon exploitation
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg font-medium">
                  <MapPin className="mr-2 h-5 w-5 text-green-600" />
                  Champs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link href="/farm/fields">
                      <MapPin className="mr-2 h-4 w-4" />
                      Voir mes champs
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link href="/farm/fields/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Ajouter un champ
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-100">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg font-medium">
                  <FileText className="mr-2 h-5 w-5 text-green-600" />
                  Annonces
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link href="/farm/announcements">
                      <FileText className="mr-2 h-4 w-4" />
                      Voir mes annonces
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Link href="/farm/announcements/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Créer une annonce
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </LayoutContent>
    </Layout>
  );
}

async function FarmCard({ userId }: { userId: string }) {
  const farms = await prisma.farm.findMany({
    where: { ownerId: userId },
    take: 1,
  });

  const farmCount = await prisma.farm.count({
    where: { ownerId: userId },
  });

  const hasFarm = farmCount > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Mon exploitation</CardTitle>
        <Tractor className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {hasFarm ? (
          <>
            <p className="font-medium">{farms[0].name}</p>
            <p className="text-sm text-muted-foreground">
              {farms[0].city || "Aucune ville"}
            </p>
            <div className="mt-4">
              <Button asChild variant="default" className="w-full">
                <Link href={`/farm/details/${farms[0].id}`}>
                  Gérer mon exploitation
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Vous n'avez pas encore créé d'exploitation.
            </p>
            <div className="mt-4">
              <Button asChild variant="default" className="w-full">
                <Link href="/farm/details/new">Créer mon exploitation</Link>
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function FarmCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 h-5 w-32" />
        <Skeleton className="mb-4 h-4 w-24" />
        <Skeleton className="h-9 w-full" />
      </CardContent>
    </Card>
  );
}

async function FieldsCard({ userId }: { userId: string }) {
  const farms = await prisma.farm.findMany({
    where: { ownerId: userId },
    select: { id: true },
  });

  const farmIds = farms.map((farm) => farm.id);

  const fieldCount = await prisma.field.count({
    where: {
      OR: [{ farmId: { in: farmIds } }, { ownerId: userId }],
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Mes champs</CardTitle>
        <MapPin className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-center py-2">
          <p className="text-3xl font-bold">{fieldCount}</p>
          <p className="text-sm text-muted-foreground">Champs enregistrés</p>
        </div>
        <div className="mt-4 space-y-2">
          <Button asChild variant="default" className="w-full">
            <Link href="/farm/fields">Voir mes champs</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/farm/fields/new">Ajouter un champ</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function FieldsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </CardHeader>
      <CardContent>
        <div className="text-center py-2">
          <Skeleton className="mx-auto h-8 w-8" />
          <Skeleton className="mx-auto mt-1 h-4 w-32" />
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

async function AnnouncementsCard({ userId }: { userId: string }) {
  const announcementCount = await prisma.announcement.count({
    where: { ownerId: userId },
  });

  const activeAnnouncementCount = await prisma.announcement.count({
    where: {
      ownerId: userId,
      isPublished: true,
    },
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Mes annonces</CardTitle>
        <FileText className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between py-2">
          <div className="text-center">
            <p className="text-3xl font-bold">{announcementCount}</p>
            <p className="text-xs text-muted-foreground">Total</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{activeAnnouncementCount}</p>
            <p className="text-xs text-muted-foreground">Actives</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Button asChild variant="default" className="w-full">
            <Link href="/farm/announcements">Voir mes annonces</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/farm/announcements/new">Créer une annonce</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AnnouncementsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </CardHeader>
      <CardContent>
        <div className="flex justify-between py-2">
          <div className="text-center">
            <Skeleton className="mx-auto h-8 w-8" />
            <Skeleton className="mx-auto mt-1 h-3 w-12" />
          </div>
          <div className="text-center">
            <Skeleton className="mx-auto h-8 w-8" />
            <Skeleton className="mx-auto mt-1 h-3 w-16" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
