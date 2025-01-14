import { Context } from '../types';
import { createAgendas } from '../data/agendas';

export async function seedAgendas(ctx: Context) {
  console.log('🌱 Seeding agendas...');
  
  const userIds = ctx.created.users.map(user => user.id);
  const announcementIds = ctx.created.announcements.map(announcement => announcement.id);
  
  const agendas = createAgendas(userIds, announcementIds);
  
  const createdAgendas = await Promise.all(
    agendas.map(agenda => ctx.prisma.agenda.create({ data: agenda }))
  );
  
  ctx.created.agendas = createdAgendas;
  return createdAgendas;
}