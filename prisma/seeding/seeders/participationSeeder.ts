import { Context } from '../types';

export async function seedParticipations(ctx: Context) {
  console.log('🌱 Seeding participations...');
  
  const participations = [
    {
      userId: ctx.created.users[1].id,
      announcementId: ctx.created.announcements[0].id,
    },
    {
      userId: ctx.created.users[4].id,
      announcementId: ctx.created.announcements[1].id,
    },
  ];
  
  const createdParticipations = await Promise.all(
    participations.map(participation => ctx.prisma.participation.create({ data: participation }))
  );
  
  ctx.created.participations = createdParticipations;
  return createdParticipations;
}