import { Context } from '../types';
import { createFeedbacks } from '../data/feedbacks';

export async function seedFeedbacks(ctx: Context) {
  console.log('🌱 Seeding feedbacks...');
  
  const userIds = ctx.created.users.map(user => user.id);
  const feedbacks = createFeedbacks(userIds);
  
  const createdFeedbacks = await Promise.all(
    feedbacks.map(feedback => ctx.prisma.feedback.create({ data: feedback }))
  );
  
  ctx.created.feedbacks = createdFeedbacks;
  return createdFeedbacks;
}