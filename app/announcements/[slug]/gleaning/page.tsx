import type { PageParams } from "@/types/next";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { format, differenceInHours } from "date-fns";
import { fr } from "date-fns/locale";
import { Metadata } from "next";
import { ContentSection } from "@/features/layout/ContentSection";
import { Suspense } from "react";
import { Announcement, Gleaning, User } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LocationSection } from "./_components/LocationSection";
import { DonationSection } from "./_components/DonationSection";
import { ChatSection } from "./_components/ChatSection";
import { RulesSection } from "./_components/RulesSection";
import { GleaningProgress } from "./_components/GleaningProgress";
import { auth } from "@/lib/auth/helper";

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
    description: "détails et participation au glanage",
  };
}

// fonction pour recup les données de l'annonce et du glanage
async function getGleaningData(slug: string): Promise<{
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
  const user = await auth();

  if (!user) {
    redirect(`/login?callbackUrl=/announcements/${slug}/gleaning`);
  }

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

  // vérifier si l'utilisateur est participant au glanage
  const participation = await prisma.participation.findUnique({
    where: {
      userId_gleaningId: {
        userId: user.id,
        gleaningId: gleaning.id,
      },
    },
  });

  // si l'utilisateur n'est pas participant, rediriger vers la page de l'annonce
  if (!participation) {
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
      // TODO: supprimer en prod car tache cron
      // mettre à jour le statut
      if (currentStatus !== gleaning.status) {
        await prisma.gleaning.update({
          where: { id: gleaning.id },
          data: { status: currentStatus },
        });
        // mise à jour de l'état
        gleaning.status = currentStatus;
      }
    }
  }

  const userIsParticipant = true;

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

  const participantsList = participants.map((p) => ({
    id: p.user.id,
    name: p.user.name,
    image: p.user.image,
  }));

  return {
    announcement,
    gleaning,
    userIsParticipant,
    participantsCount,
    participants: participantsList,
  };
}

export default async function GleaningPage(
  props: PageParams<{ slug: string }>,
) {
  const params = await props.params;

  return (
    <Suspense
      fallback={<div className="h-96 bg-muted animate-pulse rounded-lg" />}
    >
      <GleaningContent slug={params.slug} />
    </Suspense>
  );
}

async function GleaningContent({ slug }: { slug: string }) {
  const { announcement, gleaning, userIsParticipant, participantsCount } =
    await getGleaningData(slug);

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
      {/* composant de progression */}
      <GleaningProgress
        status={gleaning.status}
        startDate={announcement.startDate}
        endDate={announcement.endDate}
        formattedDate={formattedDate}
      />

      {/* navigation par onglets */}
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
              <LocationSection
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
              <DonationSection />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="chat" className="mt-0">
          <Suspense
            fallback={
              <div className="h-[300px] bg-muted animate-pulse rounded-lg" />
            }
          >
            <ChatSection
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
            <RulesSection />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
