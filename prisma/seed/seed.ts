import {
  PrismaClient,
  UserRole,
  Language,
  UserPlan,
  CropCategory,
  CropSeason,
  GleaningStatus,
  NotificationType,
  MessageType,
} from "@prisma/client";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import {
  faker,
  getRandomBelgianCity,
  belgianFirstNames,
  belgianLastNames,
  generateBelgianEmail,
  generateBelgianPhoneNumber,
  generateFarmName,
  generateAnnouncementTitle,
  generateAnnouncementDescription,
  generateComment,
  generateCatchPhrase,
  belgianCrops,
} from "./utils/faker";
import { generateSlug } from "../../src/lib/format/id";
import {
  setupStripeCustomer,
  setupResendCustomer,
} from "../../src/lib/auth/auth-config-setup";

const prisma = new PrismaClient();
const SEED_COUNT = 100;
const USER_COUNT = 120;
const CROPTYPE_COUNT = 30;

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
    console.log("no tables to truncate.");
    return;
  }

  try {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`);
    console.log("✅ database cleaned.");
  } catch (error) {
    console.error("❌ error cleaning database:", error);
  }
}

async function seedUsers() {
  console.log("🌱 seeding users...");
  const hashedPassword = await bcrypt.hash("password123", 10);

  // admin
  const adminUser = { email: "admin@field4u.be", name: "Admin Field4u" };
  const adminStripeId = await setupStripeCustomer(adminUser);
  const adminResendId = await setupResendCustomer(adminUser);
  await prisma.user.create({
    data: {
      id: nanoid(21),
      email: adminUser.email,
      name: adminUser.name,
      role: UserRole.ADMIN,
      language: Language.FRENCH,
      hashedPassword,
      onboardingCompleted: true,
      rulesAcceptedAt: new Date(),
      termsAcceptedAt: new Date(),
      acceptGeolocation: true,
      plan: UserPlan.PREMIUM,
      bio: "administrateur de la plateforme Field4u",
      city: "Bruxelles",
      postalCode: "1000",
      stripeCustomerId: adminStripeId ?? undefined,
      resendContactId: adminResendId ?? undefined,
      notificationsEnabled: true,
    },
  });

  // gleaner
  const gleanerUser = { email: "gleaner@field4u.be", name: "Gleaner Field4u" };
  const gleanerStripeId = await setupStripeCustomer(gleanerUser);
  const gleanerResendId = await setupResendCustomer(gleanerUser);
  await prisma.user.create({
    data: {
      id: nanoid(21),
      email: gleanerUser.email,
      name: gleanerUser.name,
      role: UserRole.GLEANER,
      language: Language.FRENCH,
      hashedPassword,
      onboardingCompleted: true,
      rulesAcceptedAt: new Date(),
      termsAcceptedAt: new Date(),
      acceptGeolocation: true,
      plan: UserPlan.PREMIUM,
      bio: "glaneur de la plateforme Field4u",
      city: "Bruxelles",
      postalCode: "1000",
      stripeCustomerId: gleanerStripeId ?? undefined,
      resendContactId: gleanerResendId ?? undefined,
      notificationsEnabled: true,
    },
  });

  // farmer
  const farmerUser = { email: "farmer@field4u.be", name: "Farmer Field4u" };
  const farmerStripeId = await setupStripeCustomer(farmerUser);
  const farmerResendId = await setupResendCustomer(farmerUser);
  await prisma.user.create({
    data: {
      id: nanoid(21),
      email: farmerUser.email,
      name: farmerUser.name,
      role: UserRole.FARMER,
      language: Language.FRENCH,
      hashedPassword,
      onboardingCompleted: true,
      rulesAcceptedAt: new Date(),
      termsAcceptedAt: new Date(),
      acceptGeolocation: true,
      plan: UserPlan.PREMIUM,
      bio: "agriculteur de la plateforme Field4u",
      city: "Bruxelles",
      postalCode: "1000",
      stripeCustomerId: farmerStripeId ?? undefined,
      resendContactId: farmerResendId ?? undefined,
      notificationsEnabled: true,
    },
  });

  // créer USER_COUNT/2 fermiers et USER_COUNT/2 glaneurs
  const users = [];

  // agriculteurs
  for (let i = 0; i < Math.floor(USER_COUNT / 2); i++) {
    const firstName = faker.helpers.arrayElement(belgianFirstNames);
    const lastName = faker.helpers.arrayElement(belgianLastNames);
    const city = getRandomBelgianCity();
    users.push({
      id: nanoid(21),
      email: generateBelgianEmail(firstName, lastName),
      name: `${firstName} ${lastName}`,
      role: UserRole.FARMER,
      language: faker.helpers.arrayElement([Language.FRENCH, Language.DUTCH]),
      hashedPassword,
      bio: `agriculteur·rice passionné·e de la région de ${city.city}`,
      onboardingCompleted: faker.datatype.boolean({ probability: 0.9 }),
      termsAcceptedAt: new Date(),
      rulesAcceptedAt: new Date(),
      acceptGeolocation: faker.datatype.boolean({ probability: 0.95 }),
      plan: faker.helpers.arrayElement([UserPlan.FREE, UserPlan.PREMIUM]),
      city: city.city,
      postalCode: city.postalCode,
    });
  }

  // glaneurs
  for (let i = 0; i < Math.ceil(USER_COUNT / 2); i++) {
    const firstName = faker.helpers.arrayElement(belgianFirstNames);
    const lastName = faker.helpers.arrayElement(belgianLastNames);
    const city = getRandomBelgianCity();
    users.push({
      id: nanoid(21),
      email: generateBelgianEmail(firstName, lastName),
      name: `${firstName} ${lastName}`,
      role: UserRole.GLEANER,
      language: faker.helpers.arrayElement([Language.FRENCH, Language.DUTCH]),
      hashedPassword,
      bio: faker.helpers.arrayElement([
        "engagé·e dans la lutte contre le gaspillage alimentaire",
        "passionné·e par l'agriculture locale et durable",
        "à la recherche d'une alimentation plus responsable",
        "membre actif·ve de la communauté anti-gaspi",
        "je cherche à favoriser les circuits courts",
        "sensible aux questions environnementales",
        "j'aime découvrir le travail des agriculteurs locaux",
      ]),
      onboardingCompleted: faker.datatype.boolean({ probability: 0.95 }),
      termsAcceptedAt: new Date(),
      rulesAcceptedAt: new Date(),
      acceptGeolocation: faker.datatype.boolean({ probability: 0.8 }),
      plan: UserPlan.FREE,
      city: city.city,
      postalCode: city.postalCode,
    });
  }

  return await prisma.user.createMany({ data: users });
}

async function seedCropTypes() {
  console.log("🌱 seeding crop types...");
  // générer CROPTYPE_COUNT cropTypes uniques
  const cropTypes = [];
  const usedNames = new Set();
  while (cropTypes.length < CROPTYPE_COUNT) {

    const crop = faker.helpers.arrayElement(belgianCrops);
    const cropName = crop.name; // pas d'adjectif ni de numéro
    if (usedNames.has(cropName)) continue;
    usedNames.add(cropName);
    cropTypes.push({
      id: nanoid(21),
      name: cropName,
      category:
        crop.category === "VEGETABLE"
          ? CropCategory.VEGETABLE
          : CropCategory.FRUIT,
      season:
        crop.season === "SPRING"
          ? CropSeason.SPRING
          : crop.season === "SUMMER"
            ? CropSeason.SUMMER
            : crop.season === "FALL"
              ? CropSeason.FALL
              : crop.season === "WINTER"
                ? CropSeason.WINTER
                : CropSeason.YEAR_ROUND,
    });
  }
  return await prisma.cropType.createMany({ data: cropTypes });
}

async function seedFarms() {
  console.log("🌱 seeding farms...");
  const farmers = await prisma.user.findMany({
    where: { role: UserRole.FARMER },
  });

  // environ une ferme par agriculteur
  const farms = farmers.map((farmer) => {
    const city = getRandomBelgianCity();

    return {
      id: nanoid(21),
      ownerId: farmer.id,
      name: generateFarmName(),
      slug: generateSlug(generateFarmName()),
      description: generateCatchPhrase(),
      city: city.city,
      contactInfo: generateBelgianPhoneNumber(),
      latitude: city.lat + (Math.random() * 0.02 - 0.01),
      longitude: city.lng + (Math.random() * 0.02 - 0.01),
      postalCode: city.postalCode,
    };
  });

  return await prisma.farm.createMany({ data: farms });
}

async function seedFields() {
  console.log("🌱 seeding fields...");
  const farms = await prisma.farm.findMany();
  const fields = [];

  // 2-4 champs par ferme pour avoir ~100-200 champs
  for (const farm of farms) {
    const numFields = faker.number.int({ min: 2, max: 4 });

    for (let i = 0; i < numFields; i++) {
      const cityData = getRandomBelgianCity();

      fields.push({
        id: nanoid(21),
        farmId: farm.id,
        name: `parcelle ${faker.word.adjective()} ${i + 1}`,
        city: farm.city ?? cityData.city,
        surface: faker.number.float({ min: 0.5, max: 15, fractionDigits: 1 }),
        postalCode: farm.postalCode ?? cityData.postalCode,
        latitude: farm.latitude
          ? farm.latitude + (Math.random() * 0.01 - 0.005)
          : cityData.lat,
        longitude: farm.longitude
          ? farm.longitude + (Math.random() * 0.01 - 0.005)
          : cityData.lng,
      });
    }
  }

  return await prisma.field.createMany({ data: fields });
}

async function seedAnnouncements() {
  console.log("🌱 seeding announcements...");
  const fields = await prisma.field.findMany();
  const cropTypes = await prisma.cropType.findMany();

  let count = 0;

  // environ 100 annonces au total
  for (const field of fields) {
    // arrêter si on a atteint la cible
    if (count >= SEED_COUNT) break;

    const numAnnouncements = Math.min(
      faker.number.int({ min: 1, max: 2 }),
      SEED_COUNT - count,
    );

    for (let i = 0; i < numAnnouncements; i++) {
      count++;
      const cropType = faker.helpers.arrayElement(cropTypes);

      const title = generateAnnouncementTitle(cropType.name);
      const farm = await prisma.farm.findFirst({
        where: { id: field.farmId! },
        select: { ownerId: true },
      });

      // générer des dates pour le glanage
      const now = new Date();
      let startDate, endDate;

      // 70% des annonces ont des dates dans le futur, 30% dans le passé
      if (faker.datatype.boolean({ probability: 0.7 })) {
        // dates futures
        startDate = faker.date.between({
          from: now,
          to: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
        });

        endDate = new Date(startDate);
        endDate.setDate(
          startDate.getDate() + faker.number.int({ min: 1, max: 10 }),
        );
      } else {
        // dates passées
        endDate = faker.date.between({
          from: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
          to: now,
        });

        startDate = new Date(endDate);
        startDate.setDate(
          endDate.getDate() - faker.number.int({ min: 1, max: 10 }),
        );
      }

      // Ajouter un prix suggéré à 60% des annonces
      const hasSuggestedPrice = faker.datatype.boolean({ probability: 0.6 });
      const suggestedPrice = hasSuggestedPrice
        ? faker.number.float({ min: 2, max: 20, fractionDigits: 2 })
        : null;

      await prisma.announcement.create({
        data: {
          id: nanoid(21),
          fieldId: field.id,
          title: title,
          slug: generateSlug(title),
          description: generateAnnouncementDescription(cropType.name),
          isPublished: faker.datatype.boolean({ probability: 0.9 }),
          cropTypeId: cropType.id,
          quantityAvailable: faker.number.int({ min: 10, max: 500 }),
          ownerId: farm!.ownerId,
          startDate: startDate,
          endDate: endDate,
          suggestedPrice: suggestedPrice,
        },
      });
    }
  }
}

async function seedGleanings() {
  console.log("🌱 seeding gleanings...");
  const announcements = await prisma.announcement.findMany();

  // environ 70% des annonces ont un glanage associé
  const gleanings = announcements
    .filter(() => faker.datatype.boolean({ probability: 0.7 }))
    .map((announcement) => ({
      id: nanoid(21),
      announcementId: announcement.id,
      status: faker.helpers.weightedArrayElement([
        { weight: 3, value: GleaningStatus.NOT_STARTED },
        { weight: 4, value: GleaningStatus.IN_PROGRESS },
        { weight: 2, value: GleaningStatus.COMPLETED },
        { weight: 1, value: GleaningStatus.CANCELLED },
      ]),
    }));

  return await prisma.gleaning.createMany({ data: gleanings });
}

async function seedParticipations() {
  console.log("🌱 seeding participations...");
  const gleanings = await prisma.gleaning.findMany();
  const gleaners = await prisma.user.findMany({
    where: { role: UserRole.GLEANER },
  });

  const participations = [];

  // environ 100 participations au total, réparties entre les glanages
  let count = 0;
  const targetCount = SEED_COUNT;

  for (const gleaning of gleanings) {
    if (count >= targetCount) break;

    // entre 1 et 5 participants par glanage, limité par le nombre de glaneurs
    const numParticipants = Math.min(
      faker.number.int({ min: 1, max: 5 }),
      gleaners.length,
      targetCount - count,
    );

    const participants = faker.helpers.arrayElements(gleaners, numParticipants);
    count += participants.length;

    for (const participant of participants) {
      participations.push({
        id: nanoid(21),
        userId: participant.id,
        gleaningId: gleaning.id,
      });
    }
  }

  return await prisma.participation.createMany({ data: participations });
}

async function seedParticipationPayments() {
  console.log("🌱 seeding participation payments...");
  const participations = await prisma.participation.findMany({
    include: {
      gleaning: {
        include: {
          announcement: true,
        },
      },
    },
  });

  const payments = [];
  let count = 0;
  const targetCount = Math.floor(SEED_COUNT * 0.4); // environ 40% des participations ont un paiement

  // Statuts possibles de paiement Stripe
  const paymentStatuses = [
    "succeeded",
    "processing",
    "requires_payment_method",
    "canceled",
  ];

  for (const participation of participations) {
    if (count >= targetCount) break;

    // 40% des participations ont un paiement
    if (faker.datatype.boolean({ probability: 0.4 })) {
      count++;

      // Déterminer le montant du paiement en utilisant le prix suggéré ou un montant aléatoire
      const suggestedPrice = participation.gleaning.announcement.suggestedPrice;
      const baseAmount = suggestedPrice
        ? Number(suggestedPrice)
        : faker.number.float({ min: 2, max: 20, fractionDigits: 2 });

      // Variations autour du montant suggéré
      const amount = suggestedPrice
        ? baseAmount *
          faker.number.float({ min: 0.8, max: 1.5, fractionDigits: 2 })
        : baseAmount;

      payments.push({
        id: nanoid(21),
        participationId: participation.id,
        amount: amount,
        paymentIntentId: `pi_${nanoid(24)}`,
        status: faker.helpers.arrayElement(paymentStatuses),
        createdAt: faker.date.recent({ days: 30 }),
        updatedAt: faker.date.recent({ days: 10 }),
      });
    }
  }
  return await prisma.participationPayment.createMany({ data: payments });
}

async function seedMessages() {
  console.log("🌱 seeding messages...");
  const gleanings = await prisma.gleaning.findMany();
  const users = await prisma.user.findMany();
  const messages = [];
  let count = 0;
  for (const gleaning of gleanings) {
    // 5 à 15 messages par glanage
    const numMessages = Math.floor(Math.random() * 11) + 5;
    const participants = await prisma.participation.findMany({
      where: { gleaningId: gleaning.id },
      include: { user: true },
    });
    const ownerId = (
      await prisma.announcement.findUnique({
        where: { id: gleaning.announcementId },
        select: { ownerId: true },
      })
    )?.ownerId;
    for (let i = 0; i < numMessages; i++) {
      const isGroup = Math.random() < 0.7;
      let senderId = null;
      if (isGroup && participants.length > 0) {
        senderId =
          participants[Math.floor(Math.random() * participants.length)].userId;
      } else if (ownerId) {
        senderId = ownerId;
      } else {
        senderId = users[Math.floor(Math.random() * users.length)].id;
      }
      messages.push({
        id: nanoid(21),
        gleaningId: gleaning.id,
        senderId,
        type: isGroup ? MessageType.GROUP : MessageType.OWNER,
        content: isGroup
          ? faker.lorem.sentence()
          : "message privé à l'agriculteur",
        createdAt: faker.date.recent({ days: 30 }),
      });
      count++;
    }
  }
  return await prisma.message.createMany({ data: messages });
}

async function seedReviews() {
  console.log("🌱 seeding reviews...");
  const completedGleanings = await prisma.gleaning.findMany({
    where: { status: GleaningStatus.COMPLETED },
  });

  const users = await prisma.user.findMany();
  const allGleaningIds = completedGleanings.map((g) => g.id);
  const allUserIds = users.map((u) => u.id);

  const reviews = [];
  let count = 0;
  const targetCount = Math.max(SEED_COUNT, completedGleanings.length * 2, 100);
  for (const gleaning of completedGleanings) {
    if (count >= targetCount) break;
    const participants = await prisma.participation.findMany({
      where: { gleaningId: gleaning.id },
    });
    for (const participant of participants) {
      if (count >= targetCount) break;
      if (faker.datatype.boolean({ probability: 0.8 }) || count < 50) {

        count++;
        reviews.push({
          id: nanoid(21),
          userId: participant.userId,
          gleaningId: gleaning.id,
          rating: faker.helpers.weightedArrayElement([
            { weight: 1, value: 3 },
            { weight: 2, value: 4 },
            { weight: 3, value: 5 },
            { weight: 0.5, value: 2 },
            { weight: 0.1, value: 1 },
          ]),
          content: generateComment(),
          images: faker.datatype.boolean({ probability: 0.3 })
            ? Array.from({ length: faker.number.int({ min: 1, max: 3 }) }, () =>
                faker.image.url(),
              )
            : [],
        });
      }
    }
  }

  // compléter si < 100 avec des ids valides
  while (reviews.length < 100 && allGleaningIds.length && allUserIds.length) {
    reviews.push({
      id: nanoid(21),
      userId: faker.helpers.arrayElement(allUserIds),
      gleaningId: faker.helpers.arrayElement(allGleaningIds),
      rating: faker.helpers.weightedArrayElement([
        { weight: 1, value: 3 },
        { weight: 2, value: 4 },
        { weight: 3, value: 5 },
        { weight: 0.5, value: 2 },
        { weight: 0.1, value: 1 },
      ]),
      content: generateComment(),
      images: [],
    });
  }
  return await prisma.review.createMany({ data: reviews });
}

async function seedLikes() {
  console.log("🌱 seeding likes...");
  const announcements = await prisma.announcement.findMany();
  const gleaners = await prisma.user.findMany({
    where: { role: UserRole.GLEANER },
  });

  const likes = [];
  let count = 0;
  const targetCount = SEED_COUNT;

  // distribution aléatoire des likes sur les annonces
  for (const announcement of announcements) {
    if (count >= targetCount) break;

    // 60% de chance qu'une annonce ait des likes
    if (faker.datatype.boolean({ probability: 0.6 })) {
      const maxLikes = Math.min(
        faker.number.int({ min: 1, max: 8 }),
        gleaners.length,
        targetCount - count,
      );

      const likers = faker.helpers.arrayElements(gleaners, maxLikes);
      count += likers.length;

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
  console.log("🌱 seeding favorites...");
  const announcements = await prisma.announcement.findMany();
  const gleaners = await prisma.user.findMany({
    where: { role: UserRole.GLEANER },
  });

  const favorites = [];
  let count = 0;
  const targetCount = SEED_COUNT;

  // chaque glaneur peut avoir quelques favoris
  for (const gleaner of gleaners) {
    if (count >= targetCount) break;

    // 40% de chance qu'un glaneur ait des favoris
    if (faker.datatype.boolean({ probability: 0.4 })) {
      const maxFavorites = Math.min(
        faker.number.int({ min: 1, max: 5 }),
        announcements.length,
        targetCount - count,
      );

      const favoriteAnnouncements = faker.helpers.arrayElements(
        announcements,
        maxFavorites,
      );
      count += favoriteAnnouncements.length;

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
  console.log("🌱 seeding feedbacks...");
  const users = await prisma.user.findMany();
  const feedbacks = [];
  let count = 0;
  const targetCount = SEED_COUNT;

  // feedback de la part des utilisateurs
  for (const user of users) {
    if (count >= targetCount * 0.7) break;

    // 30% de chance qu'un utilisateur donne un feedback
    if (faker.datatype.boolean({ probability: 0.3 })) {
      count++;
      feedbacks.push({
        id: nanoid(21),
        message: faker.helpers.arrayElement([
          "ajouter une fonction de messagerie entre agriculteurs et glaneurs",
          "permettre de voir la distance jusqu'au champ",
          "ajouter un système de covoiturage",
          "pouvoir filtrer par type de culture",
          "application très utile pour réduire le gaspillage alimentaire",
          "super initiative pour mettre en relation agriculteurs et glaneurs",
          "il serait utile d'avoir une notification quand une annonce est publiée près de chez moi",
          "les descriptions des champs pourraient être plus détaillées",
          "j'aimerais pouvoir télécharger un certificat après avoir participé",
          "une option pour partager les annonces sur les réseaux sociaux serait un plus",
          "pourrait-on prévoir un système de récompense pour les glaneurs réguliers?",
          "j'apprécie le système de prix libre pour soutenir les agriculteurs",
        ]),
        email: user.email,
        userId: user.id,
      });
    }
  }

  // feedback anonymes pour compléter jusqu'à 100
  const remaining = Math.max(0, targetCount - count);
  for (let i = 0; i < remaining; i++) {
    feedbacks.push({
      id: nanoid(21),
      message: faker.helpers.arrayElement([
        "comment puis-je devenir glaneur ?",
        "est-ce que l'application est disponible dans toute la belgique ?",
        "très belle initiative !",
        "je souhaite participer en tant qu'agriculteur",
        "pourriez-vous ajouter plus d'informations sur le processus de glanage?",
        "y a-t-il un moyen de contacter directement un agriculteur?",
        "j'aimerais organiser un groupe de glaneurs dans ma région",
        "existe-t-il des formations pour apprendre à glaner correctement?",
        "comment fonctionnent les dons pour les agriculteurs?",
      ]),
      email: generateBelgianEmail(),
    });
  }

  return await prisma.feedback.createMany({ data: feedbacks });
}

async function seedNotifications() {
  console.log("🌱 seeding notifications...");
  const users = await prisma.user.findMany();
  const notifications = [];
  let count = 0;
  const targetCount = SEED_COUNT * 2;

  for (const user of users) {
    if (count >= targetCount) break;

    // nombre de notifications par utilisateur
    const numNotifications = faker.number.int({
      min: 0,
      max: Math.min(8, targetCount - count),
    });
    count += numNotifications;

    for (let i = 0; i < numNotifications; i++) {
      const type = faker.helpers.arrayElement(Object.values(NotificationType));
      let message;

      // créer des messages contextuels selon le type
      switch (type) {
        case NotificationType.NEW_ANNOUNCEMENT: {
          const city = getRandomBelgianCity().city;
          message = `nouvelle opportunité de glanage près de ${city}`;
          break;
        }
        case NotificationType.PARTICIPATION_JOINED:
          message = "un glaneur a rejoint votre glanage";
          break;
        case NotificationType.ANNOUNCEMENT_REPORTED:
          message = "une de vos annonces a été signalée";
          break;
        case NotificationType.GLEANING_REMINDER_SENT:
          message = "rappel : vous avez une session de glanage demain";
          break;
        case NotificationType.GLEANING_CANCELED:
          message = "une session de glanage a été annulée";
          break;
        case NotificationType.REVIEW_POSTED:
          message = "un glaneur a laissé un avis sur votre annonce";
          break;
        case NotificationType.ACCOUNT_BANNED:
          message = "votre compte a été banni";
          break;
        case NotificationType.FEEDBACK_RECEIVED:
          message = "vous avez reçu un nouveau feedback";
          break;
        case NotificationType.INFO_REVEALED:
          message = "une information importante a été révélée";
          break;
        case NotificationType.NEW_MESSAGE:
          message = "vous avez reçu un nouveau message";
          break;
        case NotificationType.PAYMENT_RECEIVED:
          message = "paiement reçu pour votre annonce";
          break;
        default:
          message = "nouvelle notification";
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
  console.log("🌱 seeding statistics...");
  const users = await prisma.user.findMany();
  const statistics = [];

  for (const user of users) {
    // compter les participations pour cet utilisateur
    const participations = await prisma.participation.count({
      where: { userId: user.id },
    });

    // compter les annonces publiées par l'utilisateur
    const announcements = await prisma.announcement.count({
      where: { ownerId: user.id },
    });

    // compter les champs liés à l'utilisateur
    const fields = await prisma.field.count({
      where: {
        OR: [{ ownerId: user.id }, { farm: { ownerId: user.id } }],
      },
    });

    // calculer une quantité réaliste de nourriture sauvée
    const foodSaved =
      participations *
      faker.number.float({
        min: 5,
        max: 20,
        fractionDigits: 1,
      });

    statistics.push({
      id: nanoid(21),
      userId: user.id,
      totalGleanings: participations,
      totalFoodSaved: foodSaved,
      totalFields: fields,
      totalAnnouncements: announcements,
    });
  }

  return await prisma.statistic.createMany({ data: statistics });
}

async function seedAll() {
  try {
    console.log("🧹 cleaning database...");
    await cleanDatabase();
    await seedUsers();
    await seedCropTypes();
    await seedFarms();
    await seedFields();
    await seedAnnouncements();
    await seedGleanings();
    await seedParticipations();
    await seedParticipationPayments();
    await seedMessages();
    await seedReviews();
    await seedLikes();
    await seedFavorites();
    await seedFeedbacks();
    await seedNotifications();
    await seedStatistics();

    console.log("✅ database seeded successfully!");
  } catch (error) {
    console.error("❌ error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedAll().catch(console.error);
