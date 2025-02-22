import { Context } from "../types";
import { faker } from "./utils/faker";

export async function fakerGleaningPeriods(ctx: Context) {
  console.log("🌱 Seeding gleaning periods...");

  const periods = [];

  for (const field of ctx.created.fields) {
    const numPeriods = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < numPeriods; i++) {
      // Générer des périodes dans les 6 prochains mois
      const startDate = faker.date.future({ years: 0.5 });
      const endDate = new Date(startDate);
      endDate.setDate(
        startDate.getDate() + faker.number.int({ min: 1, max: 14 }),
      );

      periods.push({
        fieldId: field.id,
        startDate,
        endDate,
      });
    }
  }

  const createdPeriods = await Promise.all(
    periods.map((period) => ctx.prisma.gleaningPeriod.create({ data: period })),
  );

  ctx.created.gleaningPeriods = createdPeriods;
  return createdPeriods;
}
