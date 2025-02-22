import { Context } from "../types";
import { faker } from "./utils/faker";

export async function fakerStatistics(ctx: Context) {
  console.log("🌱 Seeding statistics...");

  const statistics = [];

  for (const user of ctx.created.users) {
    const userGleanings = ctx.created.gleanings.filter(
      (g) => g.userId === user.id,
    );
    const userAnnouncements = ctx.created.announcements.filter(
      (a) => a.ownerId === user.id,
    );
    const userFields = ctx.created.fields.filter((f) => f.ownerId === user.id);

    // Calculer le total de nourriture sauvée (en kg)
    const totalFoodSaved = userGleanings.reduce((total, gleaning) => {
      const announcement = ctx.created.announcements.find(
        (a) => a.id === gleaning.announcementId,
      );
      if (announcement) {
        // On considère que 60-90% de la quantité disponible a été glanée
        const gleanedPercentage = faker.number.float({ min: 0.6, max: 0.9 });
        if (
          announcement.quantityAvailable !== null &&
          announcement.quantityAvailable !== undefined
        ) {
          return total + announcement.quantityAvailable * gleanedPercentage;
        }
      }
      return total;
    }, 0);

    statistics.push({
      userId: user.id,
      totalGleanings: userGleanings.length,
      totalFoodSaved: Math.round(totalFoodSaved),
      totalFields: userFields.length,
      totalAnnouncements: userAnnouncements.length,
    });
  }

  const createdStatistics = await Promise.all(
    statistics.map((stat) => ctx.prisma.statistic.create({ data: stat })),
  );

  ctx.created.statistics = createdStatistics;
  return createdStatistics;
}
