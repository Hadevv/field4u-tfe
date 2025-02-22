import { Context } from "../types";
import { faker } from "./utils/faker";

export async function fakerParticipations(ctx: Context) {
  console.log("🌱 Seeding participations...");

  const gleaners = ctx.created.users.filter((user) => user.role === "GLEANER");
  const participations = [];

  for (const announcement of ctx.created.announcements) {
    // 50% de chance d'avoir des participants pour chaque annonce
    if (faker.datatype.boolean({ probability: 0.5 })) {
      const numParticipants = faker.number.int({ min: 1, max: 5 });
      const randomGleaners = faker.helpers.arrayElements(
        gleaners,
        numParticipants,
      );

      for (const gleaner of randomGleaners) {
        participations.push({
          userId: gleaner.id,
          announcementId: announcement.id,
        });
      }
    }
  }

  const createdParticipations = await Promise.all(
    participations.map((participation) =>
      ctx.prisma.participation.create({ data: participation }),
    ),
  );

  ctx.created.participations = createdParticipations;
  return createdParticipations;
}
