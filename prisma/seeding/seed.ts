import { PrismaClient } from '@prisma/client';
import { cleanDatabase } from './cleanDatabase'; // Chemin mis à jour
import { Context } from './types';

import { seedUsers } from './seeders/userSeeder';
// import { seedAccounts } from './seeders/accountSeeder';
// import { seedSessions } from './seeders/sessionSeeder';
// import { seedVerificationTokens } from './seeders/verificationTokenSeeder';
import { seedCropTypes } from './seeders/cropTypeSeeder';
import { seedFarms } from './seeders/farmSeeder';
import { seedFields } from './seeders/fieldSeeder';
import { seedGlanagePeriods } from './seeders/glanagePeriodSeeder';
import { seedAnnouncements } from './seeders/announcementSeeder';
import { seedParticipations } from './seeders/participationSeeder';
import { seedGlanages } from './seeders/glanageSeeder';
// import { seedGlanageParticipations } from './seeders/glanageParticipationSeeder';
// import { seedAnnouncementGlanagePeriods } from './seeders/announcementGlanagePeriodSeeder';
import { seedReviews } from './seeders/reviewSeeder';
import { seedStatistics } from './seeders/statisticsSeeder';
import { seedComments } from './seeders/commentSeeder';
import { seedLikes } from './seeders/likeSeeder';
import { seedFavorites } from './seeders/favoriteSeeder';
import { seedFeedbacks } from './seeders/feedbackSeeder';
import { seedNotifications } from './seeders/notificationSeeder';
import { seedAgendas } from './seeders/agendaSeeder';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Nettoyage de la base de données...');
  await cleanDatabase(prisma);

  const context: Context = {
    prisma,
    data: {
      users: [],
    //   accounts: [],
    //   sessions: [],
    //   verificationTokens: [],
      farms: [],
      cropTypes: [],
      fields: [],
      glanagePeriods: [],
      announcements: [],
      participations: [],
      glanages: [],
    //   glanageParticipations: [],
    //   announcementGlanagePeriods: [],
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
    //   accounts: [],
    //   sessions: [],
    //   verificationTokens: [],
      farms: [],
      cropTypes: [],
      fields: [],
      glanagePeriods: [],
      announcements: [],
      participations: [],
      glanages: [],
    //   glanageParticipations: [],
    //   announcementGlanagePeriods: [],
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

  try {
    // Seed dans l'ordre correct pour maintenir l'intégrité référentielle
    await seedUsers(context);
    // await seedAccounts(context);
    // await seedSessions(context);
    // await seedVerificationTokens(context);
    await seedCropTypes(context);
    await seedFarms(context);
    await seedFields(context);
    await seedGlanagePeriods(context);
    await seedAnnouncements(context);
    await seedParticipations(context);
    await seedGlanages(context);
    // await seedGlanageParticipations(context);
    // await seedAnnouncementGlanagePeriods(context);
    await seedReviews(context);
    await seedStatistics(context);
    await seedComments(context);
    await seedLikes(context);
    await seedFavorites(context);
    await seedFeedbacks(context);
    await seedNotifications(context);
    await seedAgendas(context);

    console.log('✅ Base de données initialisée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });