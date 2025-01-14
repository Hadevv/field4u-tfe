import { Context } from '../types';

export async function seedGlanages(ctx: Context) {
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
  
  const createdGlanages = await Promise.all(
    glanages.map(glanage => ctx.prisma.glanage.create({ data: glanage }))
  );
  
  ctx.created.glanages = createdGlanages;
  return createdGlanages;
}