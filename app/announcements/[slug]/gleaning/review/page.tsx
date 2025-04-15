import type { PageParams } from "@/types/next";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { requiredAuth } from "@/lib/auth/helper";
import { Metadata } from "next";
import { ContentSection } from "@/features/layout/ContentSection";
import { Suspense } from "react";
import { ReviewForm } from "./ReviewForm";
import { ExistingReview } from "./_components/ExistingReview";
import { GleaningReviewHeader } from "./_components/GleaningReviewHeader";

export async function generateMetadata(
  props: PageParams<{ slug: string }>,
): Promise<Metadata> {
  const params = await props.params;

  const announcement = await prisma.announcement.findUnique({
    where: { slug: params.slug },
    select: {
      title: true,
    },
  });

  if (!announcement) {
    return {
      title: "glanage non trouvé | field4u",
    };
  }

  return {
    title: `évaluation: ${announcement.title} | field4u`,
    description: "partagez votre expérience de glanage",
  };
}

// fonction pour vérifier si l'utilisateur a déjà laissé une évaluation
async function getReviewData(slug: string, userId: string) {
  const announcement = await prisma.announcement.findUnique({
    where: { slug },
    include: {
      owner: true,
      field: true,
      cropType: true,
      gleaning: true,
    },
  });

  if (!announcement) {
    notFound();
  }

  // vérifier que le glanage existe et est terminé
  if (!announcement.gleaning || announcement.gleaning.status !== "COMPLETED") {
    redirect(`/announcements/${slug}`);
  }

  // vérifier si l'utilisateur est participant
  const participation = await prisma.participation.findUnique({
    where: {
      userId_gleaningId: {
        userId,
        gleaningId: announcement.gleaning.id,
      },
    },
  });

  if (!participation) {
    redirect(`/announcements/${slug}`);
  }

  // vérifier si l'utilisateur a déjà laissé une évaluation
  const existingReview = await prisma.review.findFirst({
    where: {
      userId,
      gleaningId: announcement.gleaning.id,
    },
  });

  return {
    announcement,
    gleaning: announcement.gleaning,
    existingReview,
  };
}

export default async function ReviewPage(props: PageParams<{ slug: string }>) {
  const params = await props.params;
  const user = await requiredAuth();

  // obtenir les données pour afficher le stepper
  const announcement = await prisma.announcement.findUnique({
    where: { slug: params.slug },
    include: {
      gleaning: true,
    },
  });

  if (!announcement) {
    notFound();
  }

  return (
    <div className="container mx-auto pt-6 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-4/5">
          <ReviewContent slug={params.slug} userId={user.id} />
        </div>
      </div>
    </div>
  );
}

async function ReviewContent({
  slug,
  userId,
}: {
  slug: string;
  userId: string;
}) {
  const { announcement, gleaning, existingReview } = await getReviewData(
    slug,
    userId,
  );

  return (
    <div className="p-4 pb-16">
      <ContentSection>
        <GleaningReviewHeader
          title={announcement.title}
          cropTypeName={announcement.cropType.name}
          fieldName={announcement.field.name || ""}
          fieldCity={announcement.field.city || ""}
        />

        {existingReview ? (
          <Suspense
            fallback={
              <div className="h-[300px] bg-muted animate-pulse rounded-lg" />
            }
          >
            <ExistingReview review={existingReview} />
          </Suspense>
        ) : (
          <Suspense
            fallback={
              <div className="h-[500px] bg-muted animate-pulse rounded-lg" />
            }
          >
            <ReviewForm gleaningId={gleaning.id} />
          </Suspense>
        )}
      </ContentSection>
    </div>
  );
}
