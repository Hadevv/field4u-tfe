import { Context } from '../types';

export async function seedReviews(ctx: Context) {
  console.log('🌱 Seeding reviews...');
  
  const reviews = [
    {
      userId: ctx.created.users[1].id,
      gleaningId: ctx.created.gleanings[0].id,
      rating: 5,
      content: 'Excellent accueil et très bonne organisation du glanage',
    },
    {
      userId: ctx.created.users[4].id,
      gleaningId: ctx.created.gleanings[1].id,
      rating: 4,
      content: 'Belle expérience de glanage, fruits de qualité',
    },
  ];
  
  const createdReviews = await Promise.all(
    reviews.map(review => ctx.prisma.review.create({ data: review }))
  );
  
  ctx.created.reviews = createdReviews;
  return createdReviews;
}