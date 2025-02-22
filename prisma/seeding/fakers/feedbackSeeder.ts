import { Context } from "../types";
import { faker } from "./utils/faker";

export async function fakerFeedbacks(ctx: Context) {
  console.log("🌱 Seeding feedbacks...");

  const feedbacks = [];
  const users = [...ctx.created.users];

  // Feedback des utilisateurs connectés (20% de chance par utilisateur)
  for (const user of users) {
    if (faker.datatype.boolean({ probability: 0.4 })) {
      const suggestions = [
        "Ajouter une fonction de messagerie entre agriculteurs et glaneurs",
        "Permettre de voir la distance jusqu'au champ",
        "Ajouter un système de covoiturage",
        "Pouvoir filtrer par type de culture",
        "Ajouter des notifications pour les nouvelles annonces",
      ];

      const positiveMessages = [
        "Application très utile pour réduire le gaspillage alimentaire",
        "Super initiative pour mettre en relation agriculteurs et glaneurs",
        "Interface intuitive et facile à utiliser",
        "Excellent moyen de découvrir l'agriculture locale",
      ];

      feedbacks.push({
        userId: user.id,
        message: faker.datatype.boolean()
          ? faker.helpers.arrayElement(suggestions)
          : faker.helpers.arrayElement(positiveMessages),
        email: user.email,
      });
    }
  }

  // Feedback des visiteurs (10 feedbacks aléatoires)
  for (let i = 0; i < 10; i++) {
    const visitorMessages = [
      "Comment puis-je devenir glaneur ?",
      "Est-ce que l'application est disponible dans toute la Belgique ?",
      "Très belle initiative !",
      "Je souhaite participer en tant qu'agriculteur",
    ];

    feedbacks.push({
      message: faker.helpers.arrayElement(visitorMessages),
      email: faker.internet.email({ provider: "example.be" }),
    });
  }

  const createdFeedbacks = await Promise.all(
    feedbacks.map((feedback) => ctx.prisma.feedback.create({ data: feedback })),
  );

  ctx.created.feedbacks = createdFeedbacks;
  return createdFeedbacks;
}
