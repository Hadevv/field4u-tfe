import type { LayoutParams } from "@/types/next";
import { Header } from "@/features/layout/Header";

export default async function AnnouncementsLayout({ children }: LayoutParams) {
  return (
    <main>
      <Header />
      {children}
    </main>
  );
}
