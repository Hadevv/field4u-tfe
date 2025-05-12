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
import { Plus, Eye, Edit } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AnnouncementsList } from "./AnnouncementsList";
import { AnnouncementsListSkeleton } from "./AnnouncementsListSkeleton";
import { DeleteAnnouncementButton } from "./DeleteAnnouncementButton";
import { ToggleAnnouncementStatus } from "./ToggleAnnouncementStatus";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

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
          gérez vos annonces de glanage et suivez leur activité
        </LayoutDescription>
      </LayoutHeader>

      <LayoutActions>
        {hasFields ? (
          <Button asChild className="bg-primary" size="sm">
            <Link href="/farm/announcements/new">
              <Plus className="mr-2 h-4 w-4" />
              créer une annonce
            </Link>
          </Button>
        ) : (
          <Button asChild variant="outline" size="sm">
            <Link href="/farm/fields/new">
              <Plus className="mr-2 h-4 w-4" />
              créer d'abord un champ
            </Link>
          </Button>
        )}
      </LayoutActions>

      <LayoutContent>
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <CardTitle>toutes mes annonces</CardTitle>
              <CardDescription>
                liste de toutes vos annonces de glanage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnnouncementsList />
              </div>
            </CardContent>
          </Card>
        </div>
      </LayoutContent>
    </Layout>
  );
}
