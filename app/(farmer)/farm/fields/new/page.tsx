import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { FieldForm } from "../FieldForm";
import { auth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";

export default async function CreateFieldPage() {
  const user = await auth();
  if (!user) return null;

  const farm = await prisma.farm.findFirst({
    where: { ownerId: user.id },
    select: { id: true },
  });

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Ajouter un nouveau champ</LayoutTitle>
        <LayoutDescription>
          Enregistrez un nouveau champ pour pouvoir y créer des annonces de
          glanage.
        </LayoutDescription>
      </LayoutHeader>

      <LayoutContent>
        <FieldForm farmId={farm?.id} />
      </LayoutContent>
    </Layout>
  );
}
