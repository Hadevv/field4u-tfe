import { Context } from '../types';
import { createFavorites } from '../data/favorites';

export async function seedFavorites(ctx: Context) {
  console.log('🌱 Seeding favorites...');
  
  const userIds = ctx.created.users.map(user => user.id);
  const announcementIds = ctx.created.announcements.map(announcement => announcement.id);
  
  const favorites = createFavorites(userIds, announcementIds);
  
  const createdFavorites = await Promise.all(
    favorites.map(favorite => ctx.prisma.favorite.create({ data: favorite }))
  );
  
  ctx.created.favorites = createdFavorites;
  return createdFavorites;
}