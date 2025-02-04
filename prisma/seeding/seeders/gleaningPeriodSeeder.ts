import { Context } from '../types';

export async function seedGlanagePeriods(ctx: Context) {
  console.log('🌱 Seeding glanage periods...');
  
  const glanagePeriods = [
    {
      fieldId: ctx.created.fields[0].id,
      startDate: new Date('2024-09-01'),
      endDate: new Date('2024-09-30'),
    },
    {
      fieldId: ctx.created.fields[1].id,
      startDate: new Date('2024-10-01'),
      endDate: new Date('2024-10-31'),
    },
  ];
  
  const createdGlanagePeriods = await Promise.all(
    glanagePeriods.map(period => ctx.prisma.gleaningPeriod.create({ data: period }))
  );
  
  ctx.created.gleaningPeriods = createdGlanagePeriods;
  return createdGlanagePeriods;
}