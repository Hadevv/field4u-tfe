import { Button } from "@/components/ui/button";
import {
  Layout,
  LayoutContent,
  LayoutHeader,
  LayoutTitle,
  LayoutActions,
} from "@/features/page/layout";
import type { PageParams } from "@/types/next";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth/helper";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { GleaningDetailsContent } from "@/features/admin/gleanings/details/GleaningDetailsContent";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateMetadata(
  props: PageParams<{ id: string }>,
): Promise<Metadata> {
  const params = await props.params;

  try {
    const gleaning = await prisma.gleaning.findUnique({
      where: { id: params.id },
      include: {
        announcement: {
          select: { title: true },
        },
      },
    });

    if (!gleaning) {
      return {
        title: "glanage non trouvé | field4u admin",
      };
    }

    return {
      title: `${gleaning.announcement.title} | glanage | field4u admin`,
    };
  } catch (error) {
    return {
      title: "glanage | field4u admin",
    };
  }
}

export default async function GleaningDetailsPage(
  props: PageParams<{ id: string }>,
) {
  await isAdmin();

  const params = await props.params;
  const id = params.id;

  const gleaning = await prisma.gleaning.findUnique({
    where: { id },
    include: {
      announcement: {
        select: {
          id: true,
          title: true,
          slug: true,
          startDate: true,
          endDate: true,
          images: true,
          field: true,
          cropType: true,
          owner: true,
        },
      },
      participations: {
        include: {
          user: true,
        },
      },
      reviews: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!gleaning) {
    notFound();
  }

  return (
    <Layout size="full">
      <LayoutHeader>
        <LayoutTitle>détails du glanage</LayoutTitle>
      </LayoutHeader>
      <LayoutActions>
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/gleanings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            retour aux glanages
          </Link>
        </Button>
      </LayoutActions>
      <LayoutContent>
        <Suspense>
          <GleaningDetailsContent gleaning={gleaning} />
        </Suspense>
      </LayoutContent>
    </Layout>
  );
}
