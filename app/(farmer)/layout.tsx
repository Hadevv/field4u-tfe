/* eslint-disable @typescript-eslint/no-unused-vars */
import type { LayoutParams } from "@/types/next";
import { FarmerNavigation } from "./FarmerNavigation";
import { isFarmer, auth } from "@/lib/auth/helper";
import { redirect } from "next/navigation";

export default async function FarmerLayout(
  props: LayoutParams<Record<string, never>>,
) {
  // verifier que l'utilisateur est bien un agriculteur
  try {
    await isFarmer();
  } catch (error) {
    redirect("/");
  }

  // recupérer les infos de l'utilisateur
  const user = await auth();

  if (!user) {
    redirect("/auth/signin");
  }

  return <FarmerNavigation user={user}>{props.children}</FarmerNavigation>;
}
