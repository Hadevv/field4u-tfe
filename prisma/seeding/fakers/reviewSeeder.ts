import { Context } from "../types";
import { faker } from "./utils/faker";

export async function fakerReviews(ctx: Context) {
  console.log("🌱 Seeding reviews...");

  const reviews = [];

  for (const gleaning of ctx.created.gleanings) {
    // 70% de chance d'avoir un avis
    if (faker.datatype.boolean({ probability: 0.7 })) {
      const positiveReview = faker.datatype.boolean({ probability: 0.8 });
      const rating = positiveReview
        ? faker.number.int({ min: 4, max: 5 })
        : faker.number.int({ min: 1, max: 3 });

      const positiveContent = [
        "Excellente expérience de glanage !",
        "Super accueil par l'agriculteur",
        "Très bien organisé",
        "Produits de qualité",
        "Belle initiative contre le gaspillage",
      ];

      const negativeContent = [
        "Accès au champ difficile",
        "Manque d'organisation",
        "Quantité disponible plus faible que prévue",
        "Communication compliquée",
      ];

      const baseContent = positiveReview
        ? faker.helpers.arrayElement(positiveContent)
        : faker.helpers.arrayElement(negativeContent);

      reviews.push({
        userId: gleaning.userId,
        gleaningId: gleaning.id,
        rating,
        content: `${baseContent} ${faker.lorem.sentence()}`,
      });
    }
  }

  const createdReviews = await Promise.all(
    reviews.map((review) => ctx.prisma.review.create({ data: review })),
  );

  ctx.created.reviews = createdReviews;
  return createdReviews;
}
