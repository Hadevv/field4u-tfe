import { Context } from '../types';
import { createFarms } from '../data/farms';

export async function seedFarms(ctx: Context) {
  console.log('🌱 Seeding farms...');
  
  const userIds = ctx.created.users.map(user => user.id);
  const farms = createFarms(userIds);
  
  const createdFarms = await Promise.all(
    farms.map(farm => ctx.prisma.farm.create({ data: farm }))
  );
  
  ctx.created.farms = createdFarms;
  return createdFarms;
}