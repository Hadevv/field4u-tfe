/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { LayoutParams } from "@/types/next";
import { FarmerNavigation } from "./FarmerNavigation";
import { isFarmer } from "@/lib/auth/helper";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/helper";

export default async function FarmerLayout(props: LayoutParams<{}>) {
  // Vérifier que l'utilisateur est bien un agriculteur
  try {
    await isFarmer();
  } catch (error) {
    redirect("/");
  }

  // Récupérer les infos de l'utilisateur pour les passer au composant client
  const user = await auth();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <FarmerNavigation user={user} userRole={user.role}>
      {props.children}
    </FarmerNavigation>
  );
}
