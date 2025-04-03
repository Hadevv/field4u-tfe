import { auth } from "@/lib/auth/helper";
import {
  Layout,
  LayoutHeader,
  LayoutTitle,
  LayoutDescription,
  LayoutContent,
} from "@/features/page/layout";
import { FarmForm } from "../FarmForm";

export default async function NewFarmPage() {
  const user = await auth();

  if (!user) return null;

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Créer une exploitation</LayoutTitle>
        <LayoutDescription>
          Renseignez les informations de votre exploitation agricole
        </LayoutDescription>
      </LayoutHeader>

      <LayoutContent>
        <FarmForm />
      </LayoutContent>
    </Layout>
  );
}
