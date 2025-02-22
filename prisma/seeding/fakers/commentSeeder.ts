import { Context } from "../types";
import { faker } from "./utils/faker";

export async function fakerComments(ctx: Context) {
  console.log("🌱 Seeding comments...");

  const comments = [];
  const gleaners = ctx.created.users.filter((user) => user.role === "GLEANER");

  for (const announcement of ctx.created.announcements) {
    // 50% de chance d'avoir des commentaires
    if (faker.datatype.boolean({ probability: 0.4 })) {
      const numComments = faker.number.int({ min: 1, max: 3 });
      const commenters = faker.helpers.arrayElements(gleaners, numComments);

      const questions = [
        "Est-ce qu'il y a un parking à proximité ?",
        "Faut-il apporter son propre matériel ?",
        "Accessible en transport en commun ?",
        "Possible de venir avec des enfants ?",
        "Quelle est la meilleure heure pour venir ?",
        "Y a-t-il encore beaucoup de quantité disponible ?",
      ];

      for (const commenter of commenters) {
        comments.push({
          userId: commenter.id,
          announcementId: announcement.id,
          content: faker.helpers.arrayElement(questions),
        });
      }
    }
  }

  const createdComments = await Promise.all(
    comments.map((comment) => ctx.prisma.comment.create({ data: comment })),
  );

  ctx.created.comments = createdComments;
  return createdComments;
}
