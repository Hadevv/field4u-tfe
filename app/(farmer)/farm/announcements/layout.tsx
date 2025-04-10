import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes annonces - Field4u",
  description: "Gérez vos annonces de glanage sur Field4u",
};

export default function AnnouncementsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
