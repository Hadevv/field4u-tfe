import { prisma } from "@/lib/prisma";
import { GleaningCard } from "./GleaningCard";
import { EmptyState } from "./EmptyState";
import Image from "next/image";
async function getReviews(userId: string) {
  const reviews = await prisma.review.findMany({
    where: {
      userId,
    },
    include: {
      gleaning: {
        include: {
          announcement: {
            include: {
              field: true,
              cropType: true,
              owner: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return reviews;
}

export async function ReviewsList({ userId }: { userId: string }) {
  const reviews = await getReviews(userId);

  if (reviews.length === 0) {
    return (
      <EmptyState
        title="pas encore d'évaluations"
        description="évaluez vos expériences de glanage pour les retrouver ici"
        icon="review"
      />
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => {
        const gleaning = review.gleaning;
        const announcement = gleaning.announcement;

        return (
          <div
            key={review.id}
            className="space-y-3 bg-accent/30 rounded-lg p-4"
          >
            <GleaningCard
              announcement={announcement}
              gleaningStatus={gleaning.status}
              createdAt={review.createdAt}
              type="review"
            />

            <div className="mt-4 border-t pt-3">
              <div className="flex items-center mb-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ${
                        i < review.rating
                          ? "text-yellow-500 fill-current"
                          : "text-gray-300"
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm ml-2 text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <p className="text-sm">{review.content}</p>

              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                  {review.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`Photo de glanage ${index + 1}`}
                      className="h-16 w-16 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
