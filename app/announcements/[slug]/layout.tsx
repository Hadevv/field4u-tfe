import { Card, CardContent } from "@/components/ui/card";
import { GleaningStepper } from "@/features/stepper/GleaningStepper";
import { prisma } from "@/lib/prisma";
import type { LayoutParams } from "@/types/next";

export default async function AnnouncementLayout({
  children,
  params: dynamicParams,
}: LayoutParams<{ slug: string }>) {
  const params = await dynamicParams;

  // recup le statut du glanage pour l'annonce actuelle
  let gleaningStatus;
  try {
    const announcement = await prisma.announcement.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        gleaning: {
          select: {
            status: true,
          },
        },
      },
    });

    gleaningStatus = announcement?.gleaning?.status;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du statut du glanage:",
      error,
    );
  }

  return (
    <div className="container mx-auto pt-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* stepper sur le côté gauche */}
        <Card className="hidden md:block w-full md:w-[240px] bg-blanc-special overflow-hidden shadow-sm">
          <CardContent className="p-6">
            <GleaningStepper
              variant="vertical"
              gleaningStatus={gleaningStatus}
            />
          </CardContent>
        </Card>

        {/* version mobile du stepper */}
        <Card className="md:hidden w-full mb-6 bg-blanc-special overflow-hidden shadow-sm">
          <CardContent className="p-4">
            <GleaningStepper
              variant="horizontal"
              gleaningStatus={gleaningStatus}
            />
          </CardContent>
        </Card>

        {/* contenu principal */}
        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-0">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
