import { Card, CardContent } from "@/components/ui/card";
import { GleaningStepper } from "@/features/stepper/GleaningStepper";
import { prisma } from "@/lib/prisma";
import type { LayoutParams } from "@/types/next";
import { auth } from "@/lib/auth/helper";

export default async function AnnouncementLayout({
  children,
  params: dynamicParams,
}: LayoutParams<{ slug: string }>) {
  const params = await dynamicParams;
  const user = await auth();

  // recup le statut du glanage pour l'annonce actuelle
  let gleaningStatus;
  let isParticipant = false;

  try {
    const announcement = await prisma.announcement.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        gleaning: {
          select: {
            id: true,
            status: true,
            participations: user
              ? {
                  where: {
                    userId: user.id,
                  },
                  select: {
                    id: true,
                  },
                }
              : false,
          },
        },
      },
    });

    gleaningStatus = announcement?.gleaning?.status;

    // vérifier si l'utilisateur est participant au glanage
    if (user && announcement?.gleaning?.participations) {
      isParticipant = announcement.gleaning.participations.length > 0;
    }
  } catch (error) {
    console.error(
      "erreur lors de la récupération du statut du glanage:",
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
              isParticipant={isParticipant}
            />
          </CardContent>
        </Card>

        {/* version mobile du stepper */}
        <Card className="md:hidden w-full mb-6 bg-blanc-special overflow-hidden shadow-sm">
          <CardContent className="p-4">
            <GleaningStepper
              variant="horizontal"
              gleaningStatus={gleaningStatus}
              isParticipant={isParticipant}
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
