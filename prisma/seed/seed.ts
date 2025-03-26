import {
  PrismaClient,
  UserRole,
  Language,
  UserPlan,
  CropCategory,
  CropSeason,
  GleaningPeriodStatus,
  GleaningStatus,
  ParticipationStatus,
  NotificationType,
} from "@prisma/client";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import {
  faker,
  generateFarmName,
  generateBelgianPhoneNumber,
  generateAnnouncementTitle,
  generateAnnouncementDescription,
  generateComment,
  generateCatchPhrase,
} from "./utils/faker";

const prisma = new PrismaClient();
const SEED_COUNT = 100;

async function cleanDatabase() {
  const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname='public' 
    AND tablename NOT IN ('_prisma_migrations', 'spatial_ref_sys') 
  `;

  const tables = tablenames
    .map(({ tablename }) => `"public"."${tablename}"`)
    .join(", ");

  if (tables.length === 0) {
    console.log("No tables to truncate.");
    return;
  }

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    console.log("✅ Database cleaned.");
  } catch (error) {
    console.error("❌ Error cleaning database:", error);
  }
}

async function seedUsers() {
  console.log("🌱 Seeding users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  await prisma.user.create({
    data: {
      id: nanoid(21),
      email: "admin@glean.be",
      name: "Admin User",
      role: UserRole.ADMIN,
      language: Language.FRENCH,
      hashedPassword,
      onboardingCompleted: true,
      rulesAcceptedAt: new Date(),
      termsAcceptedAt: new Date(),
      acceptGeolocation: true,
      plan: UserPlan.PREMIUM,
      bio: "Administrateur de la plateforme Glean",
      city: faker.location.city(),
      postalCode: faker.location.zipCode("#####"),
    },
  });

  const users = [];
  for (let i = 0; i < SEED_COUNT; i++) {
    const role = i < SEED_COUNT / 2 ? UserRole.FARMER : UserRole.GLEANER;
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    users.push({
      id: nanoid(21),
      email: faker.internet.email({
        firstName,
        lastName,
        provider: "example.be",
      }),
      name: `${firstName} ${lastName}`,
      role,
      language: faker.helpers.arrayElement([Language.FRENCH, Language.DUTCH]),
      hashedPassword,
      bio:
        role === UserRole.FARMER
          ? `Agriculteur·rice passionné·e de la région de ${faker.location.city()}`
          : faker.helpers.arrayElement([
              "Engagé·e dans la lutte contre le gaspillage alimentaire",
              "Passionné·e par l'agriculture locale et durable",
              "À la recherche d'une alimentation plus responsable",
              "Membre actif·ve de la communauté anti-gaspi",
            ]),
      onboardingCompleted: faker.datatype.boolean({ probability: 0.9 }),
      termsAcceptedAt: new Date(),
      rulesAcceptedAt: new Date(),
      acceptGeolocation: faker.datatype.boolean({ probability: 0.6 }),
      plan:
        role === UserRole.FARMER
          ? faker.helpers.arrayElement([UserPlan.FREE, UserPlan.PREMIUM])
          : UserPlan.FREE,
      city: faker.location.city(),
      postalCode: faker.location.zipCode("#####"),
    });
  }

  return await prisma.user.createMany({ data: users });
}

async function seedCropTypes() {
  console.log("🌱 Seeding crop types...");
  const cropTypes = [
    {
      name: "Pommes de terre",
      category: CropCategory.VEGETABLE,
      season: CropSeason.FALL,
    },
    {
      name: "Carottes",
      category: CropCategory.VEGETABLE,
      season: CropSeason.YEAR_ROUND,
    },
    { name: "Pommes", category: CropCategory.FRUIT, season: CropSeason.FALL },
    { name: "Poires", category: CropCategory.FRUIT, season: CropSeason.FALL },
    {
      name: "Tomates",
      category: CropCategory.VEGETABLE,
      season: CropSeason.SUMMER,
    },
    {
      name: "Courgettes",
      category: CropCategory.VEGETABLE,
      season: CropSeason.SUMMER,
    },
    {
      name: "Haricots verts",
      category: CropCategory.VEGETABLE,
      season: CropSeason.SUMMER,
    },
    {
      name: "Fraises",
      category: CropCategory.FRUIT,
      season: CropSeason.SUMMER,
    },
    {
      name: "Oignons",
      category: CropCategory.VEGETABLE,
      season: CropSeason.YEAR_ROUND,
    },
    {
      name: "Poireaux",
      category: CropCategory.VEGETABLE,
      season: CropSeason.WINTER,
    },
  ].map((cropType) => ({
    id: nanoid(21),
    ...cropType,
  }));

  return await prisma.cropType.createMany({ data: cropTypes });
}

async function seedFarms() {
  console.log("🌱 Seeding farms...");
  const farmers = await prisma.user.findMany({
    where: { role: UserRole.FARMER },
  });

  const farms = farmers.map((farmer) => ({
    id: nanoid(21),
    ownerId: farmer.id,
    name: generateFarmName(),
    slug: nanoid(6),
    description: generateCatchPhrase(),
    city: faker.location.city(),
    contactInfo: generateBelgianPhoneNumber(),
    latitude: faker.location.latitude({ max: 51.5, min: 49.5 }),
    longitude: faker.location.longitude({ max: 6.4, min: 2.5 }),
    postalCode: faker.location.zipCode("#####"),
  }));

  return await prisma.farm.createMany({ data: farms });
}

async function seedFields() {
  console.log("🌱 Seeding fields...");
  const farms = await prisma.farm.findMany();
  const fields = [];

  for (const farm of farms) {
    const numFields = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < numFields; i++) {
      fields.push({
        id: nanoid(21),
        farmId: farm.id,
        name: `Parcelle ${faker.word.adjective()} ${i + 1}`,
        city: farm.city ?? "",
        surface: faker.number.float({ min: 0.5, max: 10, fractionDigits: 1 }),
        postalCode: farm.postalCode ?? "",
        latitude: faker.location.latitude({ max: 51.5, min: 49.5 }),
        longitude: faker.location.longitude({ max: 6.4, min: 2.5 }),
      });
    }
  }

  return await prisma.field.createMany({ data: fields });
}

async function seedGleaningPeriods() {
  console.log("🌱 Seeding gleaning periods...");
  const periods = Array.from({ length: SEED_COUNT }).map(() => {
    const startDate = faker.date.future();
    const endDate = new Date(startDate);
    endDate.setDate(
      startDate.getDate() + faker.number.int({ min: 1, max: 14 }),
    );

    return {
      id: nanoid(21),
      startDate,
      endDate,
      status: faker.helpers.arrayElement(Object.values(GleaningPeriodStatus)),
    };
  });

  return await prisma.gleaningPeriod.createMany({ data: periods });
}

async function seedAnnouncements() {
  console.log("🌱 Seeding announcements...");
  const fields = await prisma.field.findMany();
  const cropTypes = await prisma.cropType.findMany();
  const gleaningPeriods = await prisma.gleaningPeriod.findMany();

  for (const field of fields) {
    const numAnnouncements = faker.number.int({ min: 1, max: 3 });
    for (let i = 0; i < numAnnouncements; i++) {
      const cropType = faker.helpers.arrayElement(cropTypes);
      const farm = await prisma.farm.findFirst({
        where: { id: field.farmId! },
        select: { ownerId: true },
      });

      await prisma.announcement.create({
        data: {
          id: nanoid(21),
          fieldId: field.id,
          title: generateAnnouncementTitle(cropType.name),
          slug: nanoid(6),
          description: generateAnnouncementDescription(cropType.name),
          isPublished: faker.datatype.boolean({ probability: 0.9 }),
          cropTypeId: cropType.id,
          quantityAvailable: faker.number.int({ min: 50, max: 1000 }),
          ownerId: farm!.ownerId,
          gleaningPeriods: {
            create: faker.helpers
              .arrayElements(
                gleaningPeriods,
                faker.number.int({ min: 1, max: 3 }),
              )
              .map((period) => ({
                gleaningPeriodId: period.id,
              })),
          },
        },
      });
    }
  }
}

async function seedGleanings() {
  console.log("🌱 Seeding gleanings...");
  const announcements = await prisma.announcement.findMany();

  const gleanings = announcements
    .filter(() => faker.datatype.boolean({ probability: 0.7 }))
    .map((announcement) => ({
      id: nanoid(21),
      announcementId: announcement.id,
      status: faker.helpers.arrayElement(Object.values(GleaningStatus)),
    }));

  return await prisma.gleaning.createMany({ data: gleanings });
}

async function seedParticipations() {
  console.log("🌱 Seeding participations...");
  const gleanings = await prisma.gleaning.findMany();
  const gleaners = await prisma.user.findMany({
    where: { role: UserRole.GLEANER },
  });

  const participations = [];

  for (const gleaning of gleanings) {
    const numParticipants = faker.number.int({ min: 1, max: 5 });
    const participants = faker.helpers.arrayElements(gleaners, numParticipants);

    for (const participant of participants) {
      participations.push({
        id: nanoid(21),
        userId: participant.id,
        gleaningId: gleaning.id,
        status: faker.helpers.arrayElement(Object.values(ParticipationStatus)),
      });
    }
  }

  return await prisma.participation.createMany({ data: participations });
}

async function seedReviews() {
  console.log("🌱 Seeding reviews...");
  const gleanings = await prisma.gleaning.findMany({
    where: { status: GleaningStatus.COMPLETED },
  });
  const reviews = [];

  for (const gleaning of gleanings) {
    if (faker.datatype.boolean({ probability: 0.7 })) {
      const participants = await prisma.participation.findMany({
        where: {
          gleaningId: gleaning.id,
          status: ParticipationStatus.ATTENDED,
        },
      });

      for (const participant of participants) {
        if (faker.datatype.boolean({ probability: 0.8 })) {
          reviews.push({
            id: nanoid(21),
            userId: participant.userId,
            gleaningId: gleaning.id,
            rating: faker.number.int({ min: 1, max: 5 }),
            content: generateComment(),
            images: Array.from(
              { length: faker.number.int({ min: 0, max: 3 }) },
              () => faker.image.url(),
            ),
          });
        }
      }
    }
  }

  return await prisma.review.createMany({ data: reviews });
}

async function seedLikes() {
  console.log("🌱 Seeding likes...");
  const announcements = await prisma.announcement.findMany();
  const gleaners = await prisma.user.findMany({
    where: { role: UserRole.GLEANER },
  });
  const likes = [];

  for (const announcement of announcements) {
    if (faker.datatype.boolean({ probability: 0.6 })) {
      const numLikes = faker.number.int({ min: 1, max: 10 });
      const likers = faker.helpers.arrayElements(gleaners, numLikes);

      for (const liker of likers) {
        likes.push({
          id: nanoid(21),
          userId: liker.id,
          announcementId: announcement.id,
        });
      }
    }
  }

  return await prisma.like.createMany({ data: likes });
}

async function seedFavorites() {
  console.log("🌱 Seeding favorites...");
  const announcements = await prisma.announcement.findMany();
  const gleaners = await prisma.user.findMany({
    where: { role: UserRole.GLEANER },
  });
  const favorites = [];

  for (const gleaner of gleaners) {
    if (faker.datatype.boolean({ probability: 0.4 })) {
      const numFavorites = faker.number.int({ min: 1, max: 5 });
      const favoriteAnnouncements = faker.helpers.arrayElements(
        announcements,
        numFavorites,
      );

      for (const announcement of favoriteAnnouncements) {
        favorites.push({
          id: nanoid(21),
          userId: gleaner.id,
          announcementId: announcement.id,
        });
      }
    }
  }

  return await prisma.favorite.createMany({ data: favorites });
}

async function seedFeedbacks() {
  console.log("🌱 Seeding feedbacks...");
  const users = await prisma.user.findMany();
  const feedbacks = [];

  // Feedback from users
  for (const user of users) {
    if (faker.datatype.boolean({ probability: 0.3 })) {
      feedbacks.push({
        id: nanoid(21),
        message: faker.helpers.arrayElement([
          "Ajouter une fonction de messagerie entre agriculteurs et glaneurs",
          "Permettre de voir la distance jusqu'au champ",
          "Ajouter un système de covoiturage",
          "Pouvoir filtrer par type de culture",
          "Application très utile pour réduire le gaspillage alimentaire",
          "Super initiative pour mettre en relation agriculteurs et glaneurs",
        ]),
        email: user.email,
        userId: user.id,
      });
    }
  }

  // Anonymous feedback
  for (let i = 0; i < 10; i++) {
    feedbacks.push({
      id: nanoid(21),
      message: faker.helpers.arrayElement([
        "Comment puis-je devenir glaneur ?",
        "Est-ce que l'application est disponible dans toute la Belgique ?",
        "Très belle initiative !",
        "Je souhaite participer en tant qu'agriculteur",
      ]),
      email: faker.internet.email(),
    });
  }

  return await prisma.feedback.createMany({ data: feedbacks });
}

async function seedNotifications() {
  console.log("🌱 Seeding notifications...");
  const users = await prisma.user.findMany();
  const notifications = [];

  for (const user of users) {
    const numNotifications = faker.number.int({ min: 0, max: 5 });

    for (let i = 0; i < numNotifications; i++) {
      const type = faker.helpers.arrayElement(Object.values(NotificationType));
      let message;

      switch (type) {
        case NotificationType.NEW_ANNOUNCEMENT:
          message = `Nouvelle opportunité de glanage près de ${faker.location.city()}`;
          break;
        case NotificationType.RESERVATION_REQUEST:
          message = "Nouvelle demande de participation à votre annonce";
          break;
        case NotificationType.GLEANING_ACCEPTED:
          message = "Votre demande de participation a été acceptée";
          break;
        case NotificationType.NEW_REVIEW:
          message = "Un glaneur a laissé un avis sur votre annonce";
          break;
        case NotificationType.GLEANING_REMINDER:
          message = "Rappel : Vous avez une session de glanage demain";
          break;
        case NotificationType.GLEANING_CANCELLED:
          message = "Une session de glanage a été annulée";
          break;
        default:
          message = "Nouvelle notification";
      }

      notifications.push({
        id: nanoid(21),
        userId: user.id,
        type,
        message,
        isRead: faker.datatype.boolean({ probability: 0.3 }),
      });
    }
  }

  return await prisma.notification.createMany({ data: notifications });
}

async function seedStatistics() {
  console.log("🌱 Seeding statistics...");
  const users = await prisma.user.findMany();
  const statistics = [];

  for (const user of users) {
    const participations = await prisma.participation.count({
      where: { userId: user.id, status: ParticipationStatus.ATTENDED },
    });

    const announcements = await prisma.announcement.count({
      where: { ownerId: user.id },
    });

    const fields = await prisma.field.count({
      where: {
        OR: [{ ownerId: user.id }, { farm: { ownerId: user.id } }],
      },
    });

    statistics.push({
      id: nanoid(21),
      userId: user.id,
      totalGleanings: participations,
      totalFoodSaved: faker.number.float({
        min: 10,
        max: 1000,
        fractionDigits: 1,
      }),
      totalFields: fields,
      totalAnnouncements: announcements,
    });
  }

  return await prisma.statistic.createMany({ data: statistics });
}

async function seedAll() {
  try {
    console.log("🧹 Cleaning database...");
    await cleanDatabase();

    await seedUsers();
    await seedCropTypes();
    await seedFarms();
    await seedFields();
    await seedGleaningPeriods();
    await seedAnnouncements();
    await seedGleanings();
    await seedParticipations();
    await seedReviews();
    await seedLikes();
    await seedFavorites();
    await seedFeedbacks();
    await seedNotifications();
    await seedStatistics();

    console.log("✅ Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedAll().catch(console.error);
