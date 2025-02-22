import { Context } from "../types";
import {
  faker,
  generateAnnouncementTitle,
  generateAnnouncementDescription,
} from "./utils/faker";

const ANNOUNCEMENTS_PER_FIELD = 1;

export async function fakerAnnouncements(ctx: Context) {
  console.log("🌱 Seeding announcements...");

  const announcements = [];

  for (const field of ctx.created.fields) {
    const numAnnouncements = faker.number.int({
      min: 1,
      max: ANNOUNCEMENTS_PER_FIELD,
    });
    const cropType = ctx.created.cropTypes.find(
      (ct) => ct.id === field.cropTypeId,
    );

    // Récupérer le propriétaire correct
    const ownerId = field.farmId
      ? ctx.created.farms.find((f) => f.id === field.farmId)?.ownerId
      : field.ownerId;

    for (let i = 0; i < numAnnouncements; i++) {
      const gleaningPeriod = ctx.created.gleaningPeriods.find(
        (gp) => gp.fieldId === field.id,
      );

      if (gleaningPeriod && cropType && ownerId) {
        announcements.push({
          title: generateAnnouncementTitle(cropType.name),
          description: generateAnnouncementDescription(cropType.name),
          field: {
            connect: { id: field.id },
          },
          cropType: {
            connect: { id: cropType.id },
          },
          owner: {
            connect: { id: ownerId },
          },
          quantityAvailable: faker.number.int({ min: 50, max: 1000 }),
          gleaningPeriods: {
            create: {
              gleaningPeriodId: gleaningPeriod.id,
            },
          },
        });
      }
    }
  }

  const createdAnnouncements = await Promise.all(
    announcements.map((announcement) =>
      ctx.prisma.announcement.create({ data: announcement }),
    ),
  );

  ctx.created.announcements = createdAnnouncements;
  return createdAnnouncements;
}
