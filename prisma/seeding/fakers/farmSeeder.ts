import { Context } from "../types";
import {
  faker,
  generateFarmName,
  generateBelgianPhoneNumber,
  generateCatchPhrase,
} from "./utils/faker";

const NUM_FARMS_PER_FARMER = 1;

export async function fakerFarms(ctx: Context) {
  console.log("🌱 Seeding farms...");

  const farmers = ctx.created.users.filter((user) => user.role === "FARMER");
  const farms = [];

  for (const farmer of farmers) {
    for (let i = 0; i < NUM_FARMS_PER_FARMER; i++) {
      const city = faker.location.city();
      farms.push({
        name: generateFarmName(),
        description: `${generateCatchPhrase()} - Exploitation agricole familiale située à ${city}`,
        city: city,
        postalCode: faker.location.zipCode(),
        contactInfo: generateBelgianPhoneNumber(),
        latitude: parseFloat(
          faker.location.latitude({ max: 51.5, min: 49.5 }).toString(),
        ),
        longitude: parseFloat(
          faker.location.longitude({ max: 6.4, min: 2.5 }).toString(),
        ),
        ownerId: farmer.id,
      });
    }
  }

  const createdFarms = await Promise.all(
    farms.map((farm) => ctx.prisma.farm.create({ data: farm })),
  );

  ctx.created.farms = createdFarms;
  return createdFarms;
}
