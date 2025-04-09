import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mes champs - Field4u",
  description:
    "Gérez vos champs agricoles disponibles pour le glanage sur Field4u",
};

export default function FieldsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
