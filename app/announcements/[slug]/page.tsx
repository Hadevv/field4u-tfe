import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { PageParams } from "@/types/next";
import { Metadata } from "next";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Hand,
  Heart,
  Leaf,
  Link2,
  MapPin,
  MoreVertical,
  Package,
  Share2,
  ShoppingBag,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth/helper";
import { JoinGleaningButton } from "./gleaning/_components/JoinGleaningButton";

export async function generateMetadata(
  props: PageParams<{ slug: string }>,
): Promise<Metadata> {
  const params = await props.params;

  const announcement = await prisma.announcement.findUnique({
    where: { slug: params.slug },
    select: {
      title: true,
      description: true,
      cropType: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!announcement) {
    return {
      title: "Annonce non trouvée | Field4U",
      description: "L'annonce que vous recherchez n'existe pas.",
    };
  }

  return {
    title: `${announcement.title} | Field4U`,
    description: announcement.description.substring(0, 160),
  };
}

export default async function AnnouncementPage(
  props: PageParams<{ slug: string }>,
) {
  const params = await props.params;
  const user = await auth();

  const announcement = await prisma.announcement.findUnique({
    where: { slug: params.slug },
    include: {
      cropType: true,
      field: {
        select: {
          city: true,
          postalCode: true,
        },
      },
      owner: true,
      gleaningPeriods: {
        include: {
          gleaningPeriod: true,
        },
      },
      likes: user
        ? {
            where: { userId: user.id },
          }
        : false,
    },
  });

  if (!announcement) {
    notFound();
  }

  return (
    <div className="bg-[#faf9f6] rounded-lg p-8">
      {/* Header Section */}
      <div className="flex justify-between mb-2">
        <div>
          <p className="text-primary mb-1">Explorez. Partagez. Récoltez.</p>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-secondary">
              {announcement.title}
            </h1>
          </div>
        </div>
        <div>
          <p className="text-right text-[#656565]">{announcement.owner.name}</p>
        </div>
      </div>

      {/* Description and Images */}
      <div className="flex mt-6 gap-8">
        <div className="w-1/2">
          <p className="text-[#444141] mb-6">{announcement.description}</p>

          {/* Information Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Informations</h3>
            <div className="grid grid-cols-2 gap-y-6">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#f5f3ee] flex items-center justify-center mr-3">
                  <Hand className="w-4 h-4" />
                </div>
                <span className="text-sm">Pas d'outil fournis</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#f5f3ee] flex items-center justify-center mr-3">
                  <Leaf className="w-4 h-4" />
                </div>
                <span className="text-sm">{announcement.cropType.name}</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#f5f3ee] flex items-center justify-center mr-3">
                  <Link2 className="w-4 h-4" />
                </div>
                <span className="text-sm">Prendre sac</span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#f5f3ee] flex items-center justify-center mr-3">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <span className="text-sm">
                  {announcement.quantityAvailable
                    ? `${announcement.quantityAvailable} kg à glaner`
                    : "Quantité non spécifiée"}
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#f5f3ee] flex items-center justify-center mr-3">
                  <Calendar className="w-4 h-4" />
                </div>
                <span className="text-sm">
                  {announcement.gleaningPeriods[0]?.gleaningPeriod.startDate.toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#f5f3ee] flex items-center justify-center mr-3">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-sm">
                  {announcement.field.postalCode} - {announcement.field.city}
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-[#f5f3ee] flex items-center justify-center mr-3">
                  <Package className="w-4 h-4" />
                </div>
                <span className="text-sm">bio pas de pesticide</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-8">
            <JoinGleaningButton
              announcementId={announcement.id}
              slug={announcement.slug}
            />
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-[#f5f3ee] border-none"
            >
              <Heart
                className="w-4 h-4"
                data-active={announcement.likes?.length > 0}
              />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-[#f5f3ee] border-none"
            >
              <Star className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-[#f5f3ee] border-none"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-[#f5f3ee] border-none"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-1/2 relative">
          <div className="relative h-[300px] rounded-lg overflow-hidden">
            {announcement.images[0] && (
              <Image
                src={announcement.images[0]}
                alt={announcement.title}
                fill
                className="object-cover"
              />
            )}
            <Button
              variant="outline"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32">
            <Image
              src={
                announcement.images[1] ||
                announcement.images[0] ||
                "/placeholder.svg"
              }
              alt={announcement.cropType.name}
              width={150}
              height={150}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
