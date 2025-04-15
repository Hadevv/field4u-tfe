import type { LayoutParams } from "@/types/next";
import { Header } from "@/features/layout/Header";
import { Layout } from "@/features/page/layout";
export default async function AnnouncementsLayout({ children }: LayoutParams) {
  return (
    <Layout size="lg">
      <Header />
      {children}
    </Layout>
  );
}
