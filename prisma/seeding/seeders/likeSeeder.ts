import { Context } from '../types';
import { createLikes } from '../data/likes';

export async function seedLikes(ctx: Context) {
  console.log('🌱 Seeding likes...');
  
  const userIds = ctx.created.users.map(user => user.id);
  const announcementIds = ctx.created.announcements.map(announcement => announcement.id);
  
  const likes = createLikes(userIds, announcementIds);
  
  const createdLikes = await Promise.all(
    likes.map(like => ctx.prisma.like.create({ data: like }))
  );
  
  ctx.created.likes = createdLikes;
  return createdLikes;
}