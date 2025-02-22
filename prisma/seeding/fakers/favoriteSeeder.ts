import { Context } from "../types";
import { faker } from "./utils/faker";

export async function fakerFavorites(ctx: Context) {
  console.log("🌱 Seeding favorites...");

  const favorites = [];
  const gleaners = ctx.created.users.filter((user) => user.role === "GLEANER");

  for (const gleaner of gleaners) {
    // 40% de chance qu'un glaneur ait des favoris
    if (faker.datatype.boolean({ probability: 0.5 })) {
      const numFavorites = faker.number.int({ min: 1, max: 5 });
      const favoriteAnnouncements = faker.helpers.arrayElements(
        ctx.created.announcements,
        numFavorites,
      );

      for (const announcement of favoriteAnnouncements) {
        favorites.push({
          userId: gleaner.id,
          announcementId: announcement.id,
        });
      }
    }
  }

  const createdFavorites = await Promise.all(
    favorites.map((favorite) => ctx.prisma.favorite.create({ data: favorite })),
  );

  ctx.created.favorites = createdFavorites;
  return createdFavorites;
}
