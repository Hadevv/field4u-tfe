import type { LayoutParams } from "@/types/next";
import { DashboardNavigation } from "./DashboardNavigation";
import { isAdmin, auth } from "@/lib/auth/helper";
import { redirect } from "next/navigation";

export default async function RouteLayout(props: LayoutParams<{}>) {
  try {
    // Vérifier que l'utilisateur est bien un administrateur
    await isAdmin();
  } catch (error) {
    // Rediriger vers la page d'accueil si ce n'est pas un admin
    redirect("/");
  }

  // Récupérer les informations de l'utilisateur
  const user = await auth();

  // Passer l'utilisateur au composant DashboardNavigation
  return (
    <DashboardNavigation user={user}>{props.children}</DashboardNavigation>
  );
}
