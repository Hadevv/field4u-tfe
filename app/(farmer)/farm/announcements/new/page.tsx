/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { AnnouncementForm } from "../AnnouncementForm";
import { prisma } from "@/lib/prisma";
import { isFarmer, requiredAuth } from "@/lib/auth/helper";
import { notFound } from "next/navigation";

type SearchParams = {
  fieldId?: string;
};

export default async function CreateAnnouncementPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await requiredAuth();

  try {
    await isFarmer();
  } catch (error) {
    notFound();
  }

  const params = await searchParams;
  const fieldId = params.fieldId;

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

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Créer une nouvelle annonce</LayoutTitle>
        <LayoutDescription>
          Publiez une nouvelle opportunité de glanage pour partager vos surplus
          de récolte.
        </LayoutDescription>
      </LayoutHeader>

      <LayoutContent>
        <AnnouncementForm
          defaultFieldId={fieldId}
          fields={fields.map((field) => ({
            id: field.id,
            label: field.name || `Champ à ${field.city}`,
            value: field.id,
          }))}
          cropTypes={cropTypes.map((type) => ({
            id: type.id,
            label: type.name,
            value: type.id,
          }))}
          farm={farm}
          userId={user.id}
        />
      </LayoutContent>
    </Layout>
  );
}
