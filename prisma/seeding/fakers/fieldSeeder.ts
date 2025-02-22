import { Context } from "../types";
import { faker, generateFieldDescription } from "./utils/faker";

const FIELDS_PER_FARM = 3;

export async function fakerFields(ctx: Context) {
  console.log("🌱 Seeding fields...");

  const fields = [];

  for (const farm of ctx.created.farms) {
    const numFields = faker.number.int({ min: 1, max: FIELDS_PER_FARM });

    for (let i = 0; i < numFields; i++) {
      const cropType = faker.helpers.arrayElement(ctx.created.cropTypes);
      const city = farm.city;

      // Générer des coordonnées proches de la ferme
      const latOffset = faker.number.float({ min: -0.01, max: 0.01 });
      const longOffset = faker.number.float({ min: -0.01, max: 0.01 });

      fields.push({
        name: `Parcelle ${faker.word.adjective()} ${i + 1}`,
        description: generateFieldDescription(),
        city: city ?? "",
        postalCode: farm.postalCode ?? "",
        latitude: (farm.latitude ?? 0) + latOffset,
        longitude: (farm.longitude ?? 0) + longOffset,
        cropTypeId: cropType.id,
        farmId: farm.id,
        ownerId: null,
      });
    }
  }

  const createdFields = await Promise.all(
    fields.map((field) => ctx.prisma.field.create({ data: field })),
  );

  ctx.created.fields = createdFields;
  return createdFields;
}
