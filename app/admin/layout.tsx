/* eslint-disable @typescript-eslint/no-unused-vars */
import type { LayoutParams } from "@/types/next";
import { DashboardNavigation } from "./DashboardNavigation";
import { isAdmin, auth } from "@/lib/auth/helper";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Administration Field4u",
  description: "Gestion administrative de la plateforme Field4u",
};

export default async function RouteLayout(
  props: LayoutParams<Record<string, never>>,
) {
  try {
    await isAdmin();
  } catch (error) {
    redirect("/");
  }

  const user = await auth();

  return (
    <DashboardNavigation user={user}>{props.children}</DashboardNavigation>
  );
}
