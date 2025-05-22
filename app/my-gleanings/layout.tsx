import type { LayoutParams } from "@/types/next";
import { Header } from "@/features/layout/Header";
import { Layout } from "@/features/page/layout";
import { requiredAuth } from "@/lib/auth/helper";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function AnnouncementsLayout({ children }: LayoutParams) {
  // vérifie l'auth ici
  let user = null;
  try {
    user = await requiredAuth();
  } catch {
    // évite la boucle si déjà sur la route modal
    const h = await headers();
    const pathname = h.get("x-invoke-path") || "";
    if (!pathname.startsWith("/auth/signin")) {
      redirect(`/auth/signin?callbackUrl=/my-gleanings`);
    }
  }
  return (
    <Layout size="lg">
      <Header />
      {children}
    </Layout>
  );
}
