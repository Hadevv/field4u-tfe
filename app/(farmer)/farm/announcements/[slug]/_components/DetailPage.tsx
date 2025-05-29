/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
  LayoutActions,
} from "@/features/page/layout";
import { prisma } from "@/lib/prisma";
import { isFarmer, requiredAuth } from "@/lib/auth/helper";
import { notFound, redirect } from "next/navigation";
import type { PageParams } from "@/types/next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit,
  MapPin,
  Users,
  Heart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DeleteAnnouncementButton } from "../../DeleteAnnouncementButton";
import { CancelGleaningButton } from "./CancelGleaningButton";
import Link from "next/link";
import { ToggleAnnouncementStatus } from "../../ToggleAnnouncementStatus";
import Image from "next/image";
export default async function AnnouncementDetailPage({
  params,
}: PageParams<{ slug: string }>) {
  const user = await requiredAuth();

  try {
    await isFarmer();
  } catch (error) {
    notFound();
  }

  const slug = await params.slug;

  const announcement = await prisma.announcement.findUnique({
    where: { slug },
    include: {
      field: true,
      cropType: true,
      gleaning: {
        include: {
          participations: {
            include: {
              user: true,
            },
          },
          reviews: {
            include: {
              user: true,
            },
          },
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  if (!announcement) {
    notFound();
  }

  // vérifier que l'annonce appartient bien à l'agriculteur connecté
  if (announcement.ownerId !== user.id) {
    redirect("/farm/announcements");
  }

  const participationCount = announcement.gleaning?.participations.length || 0;
  const hasParticipants = participationCount > 0;
  const isGleaningCancelled = announcement.gleaning?.status === "CANCELLED";

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>{announcement.title}</LayoutTitle>
        <LayoutDescription>
          détails de votre annonce de glanage
        </LayoutDescription>
      </LayoutHeader>

      <LayoutActions>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/farm/announcements">
              <ArrowLeft className="mr-2 h-4 w-4" />
              retour aux annonces
            </Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={`/farm/announcements/${announcement.slug}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              modifier
            </Link>
          </Button>
          <ToggleAnnouncementStatus
            announcementId={announcement.id}
            isPublished={announcement.isPublished}
          />
          {announcement.gleaning && !isGleaningCancelled && (
            <CancelGleaningButton
              gleaningId={announcement.gleaning.id}
              announcementId={announcement.id}
            />
          )}
          {(!announcement.gleaning || !hasParticipants) && (
            <DeleteAnnouncementButton
              announcementId={announcement.id}
              announcementTitle={announcement.title}
            />
          )}
        </div>
      </LayoutActions>

      <LayoutContent>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>informations générales</CardTitle>
              <CardDescription>
                détails de votre annonce de glanage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex flex-wrap gap-2">
                  <Badge>{announcement.cropType.name}</Badge>
                  {announcement.quantityAvailable && (
                    <Badge variant="outline">
                      {announcement.quantityAvailable} kg disponibles
                    </Badge>
                  )}
                  {!announcement.isPublished && (
                    <Badge variant="outline" className="font-normal">
                      brouillon
                    </Badge>
                  )}
                  {isGleaningCancelled && (
                    <Badge variant="destructive">annulé</Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {announcement.field.name || announcement.field.city}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {announcement.startDate
                        ? format(announcement.startDate, "dd MMM yyyy", {
                            locale: fr,
                          })
                        : "pas de date définie"}
                      {announcement.endDate &&
                        ` - ${format(announcement.endDate, "dd MMM yyyy", {
                          locale: fr,
                        })}`}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {participationCount} glaneur
                      {participationCount !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      {announcement._count.likes} like
                      {announcement._count.likes !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>
                      créée le{" "}
                      {format(announcement.createdAt, "dd MMM yyyy", {
                        locale: fr,
                      })}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-medium mb-2">description</h3>
                  <div className="rounded-md bg-muted p-4 whitespace-pre-wrap">
                    {announcement.description}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {announcement.gleaning && (
            <Card>
              <CardHeader>
                <CardTitle>participants ({participationCount})</CardTitle>
                <CardDescription>
                  personnes inscrites à ce glanage
                </CardDescription>
              </CardHeader>
              <CardContent>
                {participationCount === 0 ? (
                  <p className="text-muted-foreground">
                    aucun glaneur inscrit pour le moment
                  </p>
                ) : (
                  <div className="space-y-2">
                    {announcement.gleaning.participations.map(
                      (participation) => (
                        <div
                          key={participation.id}
                          className="flex items-center justify-between p-2 rounded-md border"
                        >
                          <div className="flex items-center">
                            <div className="ml-2">
                              <p className="font-medium">
                                {participation.user.name || "glaneur anonyme"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                inscrit le{" "}
                                {format(
                                  participation.createdAt,
                                  "dd MMM yyyy",
                                  {
                                    locale: fr,
                                  },
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {announcement.gleaning &&
            announcement.gleaning.reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    avis des glaneurs ({announcement.gleaning.reviews.length})
                  </CardTitle>
                  <CardDescription>
                    commentaires laissés par les glaneurs après leur
                    participation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {announcement.gleaning.reviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center">
                            <div className="font-medium">
                              {review.user.name || "glaneur anonyme"}
                            </div>
                          </div>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill={
                                  i < review.rating ? "currentColor" : "none"
                                }
                                stroke="currentColor"
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                }`}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                              </svg>
                            ))}
                          </div>
                        </div>
                        {review.content && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {review.content}
                          </p>
                        )}
                        <div className="mt-2 text-xs text-muted-foreground">
                          {format(review.createdAt, "dd MMM yyyy", {
                            locale: fr,
                          })}
                        </div>
                        {review.images.length > 0 && (
                          <div className="mt-4 flex gap-2 overflow-x-auto py-2">
                            {review.images.map((image, index) => (
                              <Image
                                key={index}
                                src={image}
                                alt={`Photo ${index + 1}`}
                                width={96}
                                height={96}
                                className="h-24 w-24 rounded-md object-cover"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      </LayoutContent>
    </Layout>
  );
}
