import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mon exploitation - Field4u",
  description:
    "Gérez les informations de votre exploitation agricole sur Field4u",
};

export default function FarmDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
