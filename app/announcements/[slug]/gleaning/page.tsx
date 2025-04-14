import type { PageParams } from "@/types/next";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { requiredAuth } from "@/lib/auth/helper";
import { format, differenceInHours } from "date-fns";
import { fr } from "date-fns/locale";
import { Metadata } from "next";
import { ContentSection } from "@/features/layout/ContentSection";
import { Suspense } from "react";
import { Announcement, Gleaning, User } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationBlock } from "./_components/LocationBlock";
import { DonationBlock } from "./_components/DonationBlock";
import { ChatBlock } from "./_components/ChatBlock";
import { RulesBlock } from "./_components/RulesBlock";
import { GleaningProgress } from "./_components/GleaningProgress";

type ParticipantInfo = {
  id: string;
  name: string | null;
  image: string | null;
};

export async function generateMetadata(
  props: PageParams<{ slug: string }>,
): Promise<Metadata> {
  const params = await props.params;

  const announcement = await prisma.announcement.findUnique({
    where: { slug: params.slug },
    select: {
      title: true,
    },
  });

  if (!announcement) {
    return {
      title: "glanage non trouvé | field4u",
    };
  }

  return {
    title: `glanage: ${announcement.title} | field4u`,
    description: "détails du glanage et participants",
  };
}

// fonction pour récupérer les données de l'annonce et du glanage
async function getGleaningData(
  slug: string,
  userId: string,
): Promise<{
  announcement: Announcement & {
    owner?: User;
    field: {
      id: string;
      name: string | null;
      city: string | null;
      postalCode: string | null;
      latitude: number;
      longitude: number;
    };
    cropType: {
      id: string;
      name: string;
    };
  };
  gleaning: Gleaning;
  userIsParticipant: boolean;
  participantsCount: number;
  participants: ParticipantInfo[];
}> {
  const announcement = await prisma.announcement.findUnique({
    where: { slug },
    include: {
      owner: true,
      field: true,
      cropType: true,
    },
  });

  if (!announcement) {
    notFound();
  }

  const gleaning = await prisma.gleaning.findUnique({
    where: { announcementId: announcement.id },
  });

  if (!gleaning) {
    redirect(`/announcements/${slug}`);
  }

  // mettre à jour le statut du glanage en fonction des dates
  if (announcement.startDate && announcement.endDate) {
    const now = new Date();
    let currentStatus = gleaning.status;

    if (gleaning.status !== "CANCELLED") {
      if (now < announcement.startDate) {
        currentStatus = "NOT_STARTED";
      } else if (now >= announcement.startDate && now <= announcement.endDate) {
        currentStatus = "IN_PROGRESS";
      } else if (now > announcement.endDate) {
        currentStatus = "COMPLETED";
      }

      // mettre à jour le statut si nécessaire
      if (currentStatus !== gleaning.status) {
        await prisma.gleaning.update({
          where: { id: gleaning.id },
          data: { status: currentStatus },
        });
        // mise à jour de l'état local pour l'affichage
        gleaning.status = currentStatus;
      }
    }
  }

  // vérifier si l'utilisateur est participant au glanage
  const participation = await prisma.participation.findUnique({
    where: {
      userId_gleaningId: {
        userId,
        gleaningId: gleaning.id,
      },
    },
  });

  // nombre de participants au glanage
  const participantsCount = await prisma.participation.count({
    where: {
      gleaningId: gleaning.id,
    },
  });

  const participants = await prisma.participation.findMany({
    where: {
      gleaningId: gleaning.id,
    },
    take: 8,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  // transformer en format plus simple
  const participantsList = participants.map((p) => ({
    id: p.user.id,
    name: p.user.name,
    image: p.user.image,
  }));

  return {
    announcement,
    gleaning,
    userIsParticipant: !!participation,
    participantsCount,
    participants: participantsList,
  };
}

export default async function GleaningPage(
  props: PageParams<{ slug: string }>,
) {
  const params = await props.params;
  const user = await requiredAuth();

  return <GleaningContent slug={params.slug} userId={user.id} />;
}

async function GleaningContent({
  slug,
  userId,
}: {
  slug: string;
  userId: string;
}) {
  const { announcement, gleaning, userIsParticipant, participantsCount } =
    await getGleaningData(slug, userId);

  const formattedDate = announcement.startDate
    ? format(announcement.startDate, "EEEE d MMMM à HH:mm", { locale: fr })
    : "date non définie";

  const showRestrictedContent = !!(
    userIsParticipant &&
    announcement.startDate &&
    differenceInHours(announcement.startDate, new Date()) <= 24
  );

  return (
    <div className="p-4 pb-16">
      <ContentSection>
        {/* composant de progression combiné */}
        <GleaningProgress
          status={gleaning.status}
          startDate={announcement.startDate}
          endDate={announcement.endDate}
          formattedDate={formattedDate}
        />

        {/* navigation par onglets pour gagner de l'espace */}
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="details">détails</TabsTrigger>
            <TabsTrigger value="chat">discussions</TabsTrigger>
            <TabsTrigger value="rules">règles</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-0">
            <div className="space-y-4">
              <Suspense
                fallback={
                  <div className="h-[150px] bg-muted animate-pulse rounded-lg" />
                }
              >
                <LocationBlock
                  fieldName={announcement.field.name}
                  city={announcement.field.city}
                  postalCode={announcement.field.postalCode}
                  latitude={announcement.field.latitude}
                  longitude={announcement.field.longitude}
                  showLocation={showRestrictedContent}
                />
              </Suspense>

              <Suspense
                fallback={
                  <div className="h-[150px] bg-muted animate-pulse rounded-lg" />
                }
              >
                <DonationBlock />
              </Suspense>
            </div>
          </TabsContent>

          <TabsContent value="chat" className="mt-0">
            <Suspense
              fallback={
                <div className="h-[300px] bg-muted animate-pulse rounded-lg" />
              }
            >
              <ChatBlock
                showChat={showRestrictedContent}
                participantsCount={participantsCount}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="rules" className="mt-0">
            <Suspense
              fallback={
                <div className="h-[200px] bg-muted animate-pulse rounded-lg" />
              }
            >
              <RulesBlock />
            </Suspense>
          </TabsContent>
        </Tabs>
      </ContentSection>
    </div>
  );
}
