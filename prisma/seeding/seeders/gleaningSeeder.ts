import { Context } from '../types';

export async function seedGleanings(ctx: Context) {
  console.log('🌱 Seeding glanages...');
  
  const glanages = [
    {
      userId: ctx.created.users[1].id,
      announcementId: ctx.created.announcements[0].id,
      participations: {
        create: {
          participationId: ctx.created.participations[0].id,
        },
      },
    },
    {
      userId: ctx.created.users[4].id,
      announcementId: ctx.created.announcements[1].id,
      participations: {
        create: {
          participationId: ctx.created.participations[1].id,
        },
      },
    },
  ];
  
  const createdGleanings = await Promise.all(
    glanages.map(gleanings => ctx.prisma.gleaning.create({ data: gleanings }))
  );
  
  ctx.created.gleanings = createdGleanings;
  return createdGleanings;
}