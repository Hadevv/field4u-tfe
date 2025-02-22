import { Context } from "../types";
import { faker } from "./utils/faker";

export async function fakerLikes(ctx: Context) {
  console.log("🌱 Seeding likes...");

  const likes = [];
  const gleaners = ctx.created.users.filter((user) => user.role === "GLEANER");

  for (const announcement of ctx.created.announcements) {
    // 50% de chance d'avoir des likes
    if (faker.datatype.boolean()) {
      const numLikes = faker.number.int({ min: 1, max: 7 });
      const likers = faker.helpers.arrayElements(gleaners, numLikes);

      for (const liker of likers) {
        likes.push({
          userId: liker.id,
          announcementId: announcement.id,
        });
      }
    }
  }

  const createdLikes = await Promise.all(
    likes.map((like) => ctx.prisma.like.create({ data: like })),
  );

  ctx.created.likes = createdLikes;
  return createdLikes;
}
