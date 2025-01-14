import { Context } from '../types';
import { createComments } from '../data/comments';

export async function seedComments(ctx: Context) {
  console.log('🌱 Seeding comments...');
  
  const userIds = ctx.created.users.map(user => user.id);
  const announcementIds = ctx.created.announcements.map(announcement => announcement.id);
  
  const comments = createComments(userIds, announcementIds);
  
  const createdComments = await Promise.all(
    comments.map(comment => ctx.prisma.comment.create({ data: comment }))
  );
  
  ctx.created.comments = createdComments;
  return createdComments;
}