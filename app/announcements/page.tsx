import { Metadata } from "next";
import { SearchWizard } from "./_components/SearchWizard";
import { DynamicAnnouncementResults } from "./_components/DynamicAnnouncementResults";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Annonces de glanage | Field4U",
  description:
    "Parcourez les annonces de glanage disponibles et rejoignez une session de glanage près de chez vous.",
};

export default async function AnnouncementsPage() {
  const cropTypes = await prisma.cropType.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="container mx-auto pt-4">
      <Suspense fallback={<div className="h-20"></div>}>
        <SearchWizard cropTypes={cropTypes} />
      </Suspense>
      <Suspense fallback={null}>
        <DynamicAnnouncementResults />
      </Suspense>
    </div>
  );
}
