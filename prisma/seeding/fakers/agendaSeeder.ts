import { Context } from "../types";
import { faker } from "./utils/faker";
import { AgendaStatus } from "@prisma/client";

export async function fakerAgendas(ctx: Context) {
  console.log("🌱 Seeding agendas...");

  const agendas = [];

  for (const gleaning of ctx.created.gleanings) {
    const announcement = ctx.created.announcements.find(
      (a) => a.id === gleaning.announcementId,
    ) as {
      id: string;
      createdAt: Date;
      updatedAt: Date;
      fieldId: string;
      title: string;
      slug: string;
      description: string;
      images: string[];
      isPublished: boolean;
      cropTypeId: string;
      quantityAvailable: number | null;
      ownerId: string;
      city: string;
    };
    const cropType = announcement
      ? ctx.created.cropTypes.find((ct) => ct.id === announcement.cropTypeId)
      : null;

    if (announcement && cropType) {
      const gleaningPeriod = ctx.created.gleaningPeriods.find(
        (gp) => gp.fieldId === announcement.fieldId,
      );

      if (gleaningPeriod) {
        // Générer une date de glanage dans la période
        const startDate = new Date(
          faker.date.between({
            from: gleaningPeriod.startDate,
            to: gleaningPeriod.endDate,
          }),
        );

        // Durée de glanage entre 2 et 4 heures
        const durationHours = faker.number.int({ min: 2, max: 4 });
        const endDate = new Date(startDate);
        endDate.setHours(startDate.getHours() + durationHours);

        agendas.push({
          userId: gleaning.userId,
          announcementId: announcement.id,
          startDate,
          endDate,
          title: `Glanage de ${cropType.name} à ${announcement.city}`,
          description: `Session de glanage organisée par ${ctx.created.users.find((u) => u.id === announcement.ownerId)?.name}`,
          status: faker.helpers.arrayElement([
            AgendaStatus.CONFIRMED,
            AgendaStatus.PENDING,
            AgendaStatus.CANCELLED,
          ]),
        });
      }
    }
  }

  const createdAgendas = await Promise.all(
    agendas.map((agenda) => ctx.prisma.agenda.create({ data: agenda })),
  );

  ctx.created.agendas = createdAgendas;
  return createdAgendas;
}
