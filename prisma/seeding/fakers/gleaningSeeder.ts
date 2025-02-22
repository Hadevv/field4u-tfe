import { Context } from "../types";
import { faker } from "./utils/faker";

export async function fakerGleanings(ctx: Context) {
  console.log("🌱 Seeding gleanings...");

  const gleanings = [];

  for (const participation of ctx.created.participations) {
    // 50% de chance que la participation devienne un glanage
    if (faker.datatype.boolean()) {
      gleanings.push({
        userId: participation.userId,
        announcementId: participation.announcementId,
        participations: {
          create: {
            participationId: participation.id,
          },
        },
      });
    }
  }

  const createdGleanings = await Promise.all(
    gleanings.map((gleaning) => ctx.prisma.gleaning.create({ data: gleaning })),
  );

  ctx.created.gleanings = createdGleanings;
  return createdGleanings;
}
