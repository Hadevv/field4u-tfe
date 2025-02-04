import { Context } from '../types';

export async function seedAnnouncements(ctx: Context) {
  console.log('🌱 Seeding announcements...');
  
  const announcements = [
    {
      title: 'Glanage de pommes de terre',
      description: 'Venez glaner des pommes de terre bio après la récolte principale',
      fieldId: ctx.created.fields[0].id,
      cropTypeId: ctx.created.cropTypes[0].id,
      ownerId: ctx.created.users[0].id,
      quantityAvailable: 500,
      gleaningPeriods: {
        create: {
          gleaningPeriodId: ctx.created.gleaningPeriods[0].id,
        },
      },
    },
    {
      title: 'Pommes à glaner',
      description: 'Pommes non récoltées disponibles pour le glanage',
      fieldId: ctx.created.fields[1].id,
      cropTypeId: ctx.created.cropTypes[2].id,
      ownerId: ctx.created.users[3].id,
      quantityAvailable: 300,
      gleaningPeriods: {
        create: {
          gleaningPeriodId: ctx.created.gleaningPeriods[1].id,
        },
      },
    },
  ];
  
  const createdAnnouncements = await Promise.all(
    announcements.map(announcement => ctx.prisma.announcement.create({ data: announcement }))
  );
  
  ctx.created.announcements = createdAnnouncements;
  return createdAnnouncements;
}