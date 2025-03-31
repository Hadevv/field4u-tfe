import { Clock, Users, MapPin } from "lucide-react";
import type { PageParams } from "@/types/next";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { requiredAuth } from "@/lib/auth/helper";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { GleaningActions } from "./_components/GleaningActions";
import { Metadata } from "next";

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
      title: "Glanage non trouvé | Field4U",
    };
  }

  return {
    title: `Glanage: ${announcement.title} | Field4U`,
    description: "Détails du glanage et participants",
  };
}

export default async function GleaningPage(
  props: PageParams<{ slug: string }>,
) {
  const params = await props.params;
  const user = await requiredAuth();

  // Récupérer l'annonce
  const announcement = await prisma.announcement.findUnique({
    where: { slug: params.slug },
    include: {
      field: true,
      gleaningPeriods: {
        include: {
          gleaningPeriod: true,
        },
      },
    },
  });

  if (!announcement) {
    notFound();
  }

  // Récupérer le glanage (devrait être unique car announcementId est unique)
  const gleaning = await prisma.gleaning.findUnique({
    where: { announcementId: announcement.id },
  });

  if (!gleaning) {
    // Si pas de glanage, rediriger vers la page de l'annonce
    redirect(`/announcements/${params.slug}`);
  }

  // Récupérer les participants confirmés
  const confirmedParticipants = await prisma.participation.findMany({
    where: {
      gleaningId: gleaning.id,
      status: {
        in: ["CONFIRMED", "ATTENDED"],
      },
    },
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

  // Vérifier si l'utilisateur participe
  const userParticipation = await prisma.participation.findUnique({
    where: {
      userId_gleaningId: {
        userId: user.id,
        gleaningId: gleaning.id,
      },
    },
  });

  // Vérifier si l'utilisateur est un participant
  const isParticipant = userParticipation !== null;

  return (
    <div className="space-y-6">
      {/* Statut et Timer */}
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-secondary">
                {gleaning.status}
              </h3>
              <p className="text-muted-foreground">
                {announcement.gleaningPeriods[0]?.gleaningPeriod.startDate &&
                  format(
                    announcement.gleaningPeriods[0].gleaningPeriod.startDate,
                    "EEEE d MMMM à HH:mm",
                    { locale: fr },
                  )}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Informations sensibles */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <span>
              {announcement.field.name}, {announcement.field.city}
            </span>
          </div>
          <div className="aspect-square relative rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              src={`https://maps.google.com/maps?q=${announcement.field.latitude},${announcement.field.longitude}&z=15&output=embed`}
            ></iframe>
          </div>
        </div>
      </Card>

      {/* Liste des participants */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-muted-foreground" />
            <h3 className="font-semibold">
              Participants ({confirmedParticipants.length})
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {confirmedParticipants.map((participation) => (
              <div
                key={participation.id}
                className="flex items-center gap-2 p-2 rounded-lg bg-muted"
              >
                <Avatar>
                  <AvatarImage src={participation.user.image || undefined} />
                  <AvatarFallback>
                    {participation.user.name?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{participation.user.name}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Actions */}
      <GleaningActions
        gleaningId={gleaning.id}
        isParticipant={isParticipant}
        slug={params.slug}
      />
    </div>
  );
}
