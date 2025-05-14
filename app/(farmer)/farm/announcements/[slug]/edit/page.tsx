/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { AnnouncementForm } from "../../AnnouncementForm";
import { prisma } from "@/lib/prisma";
import { isFarmer, requiredAuth } from "@/lib/auth/helper";
import { notFound, redirect } from "next/navigation";
import type { PageParams } from "@/types/next";

export default async function EditAnnouncementPage({
  params,
}: PageParams<{ slug: string }>) {
  const user = await requiredAuth();

  try {
    await isFarmer();
  } catch (error) {
    notFound();
  }

  const slug = await params.slug;

  // récupérer l'annonce à partir du slug
  const announcement = await prisma.announcement.findUnique({
    where: { slug },
    include: {
      cropType: true,
    },
  });

  if (!announcement) {
    notFound();
  }

  // vérifier que l'annonce appartient bien à l'agriculteur connecté
  if (announcement.ownerId !== user.id) {
    redirect("/farm/announcements");
  }

  // récupérer les champs et types de culture pour le formulaire
  const [fields, cropTypes, farm] = await Promise.all([
    prisma.field.findMany({
      where: {
        OR: [
          { ownerId: user.id },
          {
            farm: {
              ownerId: user.id,
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        city: true,
      },
    }),
    prisma.cropType.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.farm.findFirst({
      where: {
        ownerId: user.id,
      },
      select: {
        id: true,
        name: true,
      },
    }),
  ]);

  const formattedAnnouncement = {
    ...announcement,
    startDate: announcement.startDate,
    endDate: announcement.endDate,
    suggestedPrice: announcement.suggestedPrice
      ? parseFloat(announcement.suggestedPrice.toString())
      : undefined,
  };

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>modifier l'annonce</LayoutTitle>
        <LayoutDescription>
          mettez à jour votre opportunité de glanage pour partager vos surplus
          de récolte
        </LayoutDescription>
      </LayoutHeader>

      <LayoutContent>
        <AnnouncementForm
          announcement={formattedAnnouncement}
          fields={fields.map((field) => ({
            id: field.id,
            label: field.name || `champ à ${field.city}`,
            value: field.id,
          }))}
          cropTypes={cropTypes.map((type) => ({
            id: type.id,
            label: type.name,
            value: type.id,
          }))}
          farm={farm}
          userId={user.id}
          initialData={formattedAnnouncement}
        />
      </LayoutContent>
    </Layout>
  );
}
