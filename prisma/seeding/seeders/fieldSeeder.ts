import { Context } from '../types';
import { createFields } from '../data/fields';

export async function seedFields(ctx: Context) {
  console.log('🌱 Seeding fields...');
  
  const farmIds = ctx.created.farms.map(farm => farm.id);
  const cropTypeIds = ctx.created.cropTypes.map(cropType => cropType.id);
  const userIds = ctx.created.users.map(user => user.id);
  
  const fields = createFields(farmIds, cropTypeIds, userIds);
  
  const createdFields = await Promise.all(
    fields.map(field => ctx.prisma.field.create({ data: field }))
  );
  
  ctx.created.fields = createdFields;
  return createdFields;
}