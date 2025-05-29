import { Star } from "lucide-react";
import { Review } from "@prisma/client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type ExistingReviewProps = {
  review: Review;
};

export function ExistingReview({ review }: ExistingReviewProps) {
  return (
    <div className="space-y-6">
      <div className="bg-background rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-lg font-medium">votre évaluation</h2>
          <div className="text-xs text-muted-foreground">
            publiée le{" "}
            {format(new Date(review.createdAt), "d MMMM yyyy", { locale: fr })}
          </div>
        </div>

        {/* rating */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">votre note</h3>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-6 w-6",
                  star <= review.rating
                    ? "text-yellow-500 fill-yellow-500"
                    : "text-muted",
                )}
              />
            ))}
          </div>
        </div>

        {/* review */}
        <div className="mb-6">
          <h3 className="text-sm font-medium mb-2">votre commentaire</h3>
          <div className="text-sm bg-background p-4 rounded-md">
            {review.content}
          </div>
        </div>

        {/* images */}
        {review.images && review.images.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3">vos photos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {review.images.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square relative rounded-md overflow-hidden"
                >
                  <Image
                    src={image}
                    alt={`review image ${index + 1}`}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          merci d'avoir partagé votre expérience! cela aide la communauté à
          mieux connaître ce glanage
        </p>
      </div>
    </div>
  );
}
