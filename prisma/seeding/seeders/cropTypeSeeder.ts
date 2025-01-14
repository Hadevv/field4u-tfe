import { Context } from '../types';
import { cropTypes } from '../data/cropTypes';

export async function seedCropTypes(ctx: Context) {
  console.log('🌱 Seeding crop types...');
  
  const createdCropTypes = await Promise.all(
    cropTypes.map(cropType => ctx.prisma.cropType.create({ data: cropType }))
  );
  
  ctx.created.cropTypes = createdCropTypes;
  return createdCropTypes;
}