import { Context } from '../types';

export async function seedStatistics(ctx: Context) {
  console.log('🌱 Seeding statistics...');
  
  const statistics = ctx.created.users.map(user => ({
    userId: user.id,
    totalGleanings: 0,
    totalFoodSaved: 0,
    totalFields: 0,
    totalAnnouncements: 0,
  }));
  
  const createdStatistics = await Promise.all(
    statistics.map(stat => ctx.prisma.statistics.create({ data: stat }))
  );
  
  ctx.created.statistics = createdStatistics;
  return createdStatistics;
}