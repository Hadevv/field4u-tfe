/* eslint-disable @typescript-eslint/no-unused-vars */
import type { LayoutParams } from "@/types/next";
import { FarmerNavigation } from "./FarmerNavigation";
import { isFarmer, auth } from "@/lib/auth/helper";
import { redirect } from "next/navigation";

export default async function FarmerLayout(
  props: LayoutParams<Record<string, never>>,
) {
  // Vérifier que l'utilisateur est bien un agriculteur
  try {
    await isFarmer();
  } catch (error) {
    redirect("/");
  }

  // Récupérer les infos de l'utilisateur pour les passer au composant client
  const user = await auth();

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <FarmerNavigation user={user} userRole={user.role}>
      {props.children}
    </FarmerNavigation>
  );
}
