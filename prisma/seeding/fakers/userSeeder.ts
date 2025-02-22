import { Context } from "../types";
import { faker } from "./utils/faker";
import { UserRole, Language } from "@prisma/client";
import bcrypt from "bcrypt";

const NUM_FARMERS = 60;
const NUM_GLEANERS = 90;

export async function fakerUsers(ctx: Context) {
  console.log("🌱 Seeding users...");

  const hashedPassword = await bcrypt.hash("password123", 10);
  const users = [];

  // Admin user
  users.push({
    email: "admin@glean.be",
    name: "Admin User",
    role: UserRole.ADMIN,
    language: Language.FRENCH,
    hashedPassword,
    onboardingCompleted: true,
  });

  // Farmers
  for (let i = 0; i < NUM_FARMERS; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    users.push({
      email: faker.internet.email({
        firstName,
        lastName,
        provider: "example.be",
      }),
      name: `${firstName} ${lastName}`,
      role: UserRole.FARMER,
      language: Language.FRENCH,
      hashedPassword,
      bio: `Agriculteur·rice passionné·e de la région de ${faker.location.city()}`,
      onboardingCompleted: faker.datatype.boolean({ probability: 0.9 }),
    });
  }

  // Gleaners
  for (let i = 0; i < NUM_GLEANERS; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    users.push({
      email: faker.internet.email({
        firstName,
        lastName,
        provider: "example.be",
      }),
      name: `${firstName} ${lastName}`,
      role: UserRole.GLEANER,
      language: faker.helpers.arrayElement([Language.FRENCH, Language.DUTCH]),
      hashedPassword,
      bio: faker.helpers.arrayElement([
        "Engagé·e dans la lutte contre le gaspillage alimentaire",
        "Passionné·e par l'agriculture locale et durable",
        "À la recherche d'une alimentation plus responsable",
        "Membre actif·ve de la communauté anti-gaspi",
      ]),
      onboardingCompleted: faker.datatype.boolean({ probability: 0.8 }),
    });
  }

  const createdUsers = await Promise.all(
    users.map((user) => ctx.prisma.user.create({ data: user })),
  );

  ctx.created.users = createdUsers;
  return createdUsers;
}
