/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { cleanDatabase } from "./cleanDatabase";
import { Context } from "./types";

// Seeders
import { seedUsers } from "./seeders/userSeeder";
import { seedCropTypes } from "./seeders/cropTypeSeeder";
import { seedFarms } from "./seeders/farmSeeder";
import { seedFields } from "./seeders/fieldSeeder";
import { seedGleaningPeriods } from "./seeders/gleaningPeriodSeeder";
import { seedAnnouncements } from "./seeders/announcementSeeder";
import { seedParticipations } from "./seeders/participationSeeder";
import { seedGleanings } from "./seeders/gleaningSeeder";
import { seedReviews } from "./seeders/reviewSeeder";
import { seedStatistics } from "./seeders/statisticsSeeder";
import { seedComments } from "./seeders/commentSeeder";
import { seedLikes } from "./seeders/likeSeeder";
import { seedFavorites } from "./seeders/favoriteSeeder";
import { seedFeedbacks } from "./seeders/feedbackSeeder";
import { seedNotifications } from "./seeders/notificationSeeder";
import { seedAgendas } from "./seeders/agendaSeeder";

// Fakers
import { fakerUsers } from "./fakers/userSeeder";
import { fakerCropTypes } from "./fakers/cropTypeSeeder";
import { fakerFarms } from "./fakers/farmSeeder";
import { fakerFields } from "./fakers/fieldSeeder";
import { fakerGleaningPeriods } from "./fakers/gleaningPeriodSeeder";
import { fakerAnnouncements } from "./fakers/announcementSeeder";
import { fakerParticipations } from "./fakers/participationSeeder";
import { fakerGleanings } from "./fakers/gleaningSeeder";
import { fakerReviews } from "./fakers/reviewSeeder";
import { fakerStatistics } from "./fakers/statisticsSeeder";
import { fakerComments } from "./fakers/commentSeeder";
import { fakerLikes } from "./fakers/likeSeeder";
import { fakerFavorites } from "./fakers/favoriteSeeder";
import { fakerFeedbacks } from "./fakers/feedbackSeeder";
import { fakerNotifications } from "./fakers/notificationSeeder";
import { fakerAgendas } from "./fakers/agendaSeeder";

const prisma = new PrismaClient();

// Récupération des arguments de la ligne de commande
// mode : "seed" ou "faker"
// functionName (optionnel) : le nom de la fonction à exécuter (ex: "seedFarms" ou "fakerFarms")
const mode = process.argv[2];
const functionName = process.argv[3];

const seeders: Record<string, (ctx: Context) => Promise<any>> = {
  seedUsers,
  seedCropTypes,
  seedFarms,
  seedFields,
  seedGleaningPeriods,
  seedAnnouncements,
  seedParticipations,
  seedGleanings,
  seedReviews,
  seedStatistics,
  seedComments,
  seedLikes,
  seedFavorites,
  seedFeedbacks,
  seedNotifications,
  seedAgendas,
};

const fakers: Record<string, (ctx: Context, count?: number) => Promise<any>> = {
  fakerUsers,
  fakerCropTypes,
  fakerFarms,
  fakerFields,
  fakerGleaningPeriods,
  fakerAnnouncements,
  fakerParticipations,
  fakerGleanings,
  fakerReviews,
  fakerStatistics,
  fakerComments,
  fakerLikes,
  fakerFavorites,
  fakerFeedbacks,
  fakerNotifications,
  fakerAgendas,
};

async function main() {
  console.log("🧹 Nettoyage de la base de données...");
  await cleanDatabase(prisma);

  const context: Context = {
    prisma,
    data: {
      users: [],
      farms: [],
      cropTypes: [],
      fields: [],
      gleaningPeriods: [],
      announcements: [],
      participations: [],
      gleanings: [],
      reviews: [],
      statistics: [],
      feedbacks: [],
      notifications: [],
      agendas: [],
      comments: [],
      likes: [],
      favorites: [],
    },
    created: {
      users: [],
      farms: [],
      cropTypes: [],
      fields: [],
      gleaningPeriods: [],
      announcements: [],
      participations: [],
      gleanings: [],
      reviews: [],
      statistics: [],
      feedbacks: [],
      notifications: [],
      agendas: [],
      comments: [],
      likes: [],
      favorites: [],
    },
  };

  if (!mode) {
    console.error("❌ Vous devez spécifier le mode ('seed' ou 'faker').");
    process.exit(1);
  }

  // Si aucun nom de fonction n'est fourni, on exécute tous les seeders ou fakers
  if (!functionName) {
    if (mode === "seed") {
      console.log("🌱 Exécution de tous les seeders...");
      for (const key in seeders) {
        console.log(`→ Exécution de ${key}...`);
        await seeders[key](context);
      }
    } else if (mode === "faker") {
      console.log("🎭 Exécution de tous les fakers...");
      for (const key in fakers) {
        console.log(`→ Exécution de ${key}...`);
        // Ici, 100 est le nombre d'entrées par défaut, modifie selon tes besoins
        await fakers[key](context, 150);
      }
    } else {
      console.error("❌ Mode inconnu. Utilisez 'seed' ou 'faker'.");
      process.exit(1);
    }
  } else {
    // Si un nom de fonction est fourni, exécuter uniquement cette fonction
    if (mode === "seed") {
      if (seeders[functionName]) {
        console.log(`🌱 Exécution du seeder : ${functionName}`);
        await seeders[functionName](context);
      } else {
        console.error(`❌ Seeder '${functionName}' introuvable.`);
        process.exit(1);
      }
    } else if (mode === "faker") {
      if (fakers[functionName]) {
        console.log(`🎭 Exécution du faker : ${functionName}`);
        await fakers[functionName](context, 100);
      } else {
        console.error(`❌ Faker '${functionName}' introuvable.`);
        process.exit(1);
      }
    } else {
      console.error("❌ Mode inconnu. Utilisez 'seed' ou 'faker'.");
      process.exit(1);
    }
  }

  console.log("✅ Exécution terminée !");
}

main()
  .catch((e) => {
    console.error(
      "❌ Erreur lors de l'initialisation de la base de données:",
      e,
    );
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
