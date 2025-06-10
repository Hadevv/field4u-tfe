/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { getGleaningStatusInfo } from "@/lib/format/gleaningStatus";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MapPin,
  Calendar,
  User,
  Star,
  ExternalLink,
  Mail,
  Clock,
  Leaf,
  Users,
} from "lucide-react";
import Image from "next/image";
import { Review, User as UserType } from "@prisma/client";

type GleaningDetailsProps = {
  gleaning: any;
};

export function GleaningDetailsContent({ gleaning }: GleaningDetailsProps) {
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "non spécifié";
    return format(date, "dd MMMM yyyy 'à' HH'h'mm", { locale: fr });
  };

  const statusInfo = getGleaningStatusInfo(
    gleaning.announcement.startDate,
    gleaning.announcement.endDate,
    gleaning.status,
  );

  const renderImage = (image: string, index: number) => (
    <div
      key={index}
      className="relative aspect-square h-auto w-full overflow-hidden rounded-md"
    >
      <Image
        src={image}
        alt={`Image ${index + 1} de l'annonce`}
        fill
        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Informations générales sur le glanage */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-baseline justify-between">
            <span className="text-xl">{gleaning.announcement.title}</span>
            <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
          </CardTitle>
          <CardDescription>
            Session de glanage créée le {formatDate(gleaning.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Informations sur le lieu */}
            <div className="space-y-3">
              <div className="text-sm font-medium">localisation</div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="size-4 text-muted-foreground mt-0.5" />
                <div>
                  <p>{gleaning.announcement.field.city}</p>
                  <p className="text-muted-foreground">
                    {gleaning.announcement.field.postalCode}
                  </p>
                </div>
              </div>
            </div>

            {/* Informations sur les dates */}
            <div className="space-y-3">
              <div className="text-sm font-medium">période</div>
              {gleaning.announcement.startDate &&
              gleaning.announcement.endDate ? (
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2 text-sm">
                    <Calendar className="size-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p>
                        début: {formatDate(gleaning.announcement.startDate)}
                      </p>
                      <p>fin: {formatDate(gleaning.announcement.endDate)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="size-4 text-muted-foreground" />
                  <p className="text-muted-foreground">dates non planifiées</p>
                </div>
              )}
            </div>

            {/* Informations sur l'agriculteur */}
            <div className="space-y-3">
              <div className="text-sm font-medium">agriculteur</div>
              <div className="flex items-start gap-2 text-sm">
                <User className="size-4 text-muted-foreground mt-0.5" />
                <div>
                  <div className="flex items-center gap-2">
                    <Avatar className="size-5">
                      <AvatarFallback className="text-[10px]">
                        {gleaning.announcement.owner.name?.slice(0, 2) || "?"}
                      </AvatarFallback>
                      {gleaning.announcement.owner.image && (
                        <AvatarImage src={gleaning.announcement.owner.image} />
                      )}
                    </Avatar>
                    <p>{gleaning.announcement.owner.name || "non spécifié"}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Mail className="size-3.5 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {gleaning.announcement.owner.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Culture */}
            <div className="space-y-3">
              <div className="text-sm font-medium">culture</div>
              <div className="flex items-start gap-2 text-sm">
                <Leaf className="size-4 text-muted-foreground mt-0.5" />
                <div>
                  <p>{gleaning.announcement.cropType.name}</p>
                </div>
              </div>
            </div>

            {/* Participation */}
            <div className="space-y-3">
              <div className="text-sm font-medium">participants</div>
              <div className="flex items-start gap-2 text-sm">
                <Users className="size-4 text-muted-foreground mt-0.5" />
                <div>
                  <p>
                    {gleaning.participations.length}{" "}
                    {gleaning.participations.length > 1
                      ? "participants"
                      : "participant"}
                  </p>
                </div>
              </div>
            </div>

            {/* Avis */}
            <div className="space-y-3">
              <div className="text-sm font-medium">avis</div>
              <div className="flex items-start gap-2 text-sm">
                <Star className="size-4 text-amber-500 mt-0.5" />
                <div>
                  <p>
                    {gleaning.reviews.length}{" "}
                    {gleaning.reviews.length > 1 ? "avis" : "avis"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button asChild variant="outline" size="sm">
              <Link
                href={`/announcements/${gleaning.announcement.slug}`}
                target="_blank"
              >
                voir l'annonce <ExternalLink className="ml-2 size-3.5" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Images de l'annonce */}
      {gleaning.announcement.images &&
        gleaning.announcement.images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>images</CardTitle>
              <CardDescription>
                galerie d'images de l'annonce associée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gleaning.announcement.images.map(renderImage)}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Tabs pour les participants et les avis */}
      <Tabs defaultValue="participants">
        <TabsList>
          <TabsTrigger value="participants">
            participants ({gleaning.participations.length})
          </TabsTrigger>
          <TabsTrigger value="reviews">
            avis ({gleaning.reviews.length})
          </TabsTrigger>
        </TabsList>

        {/* Liste des participants */}
        <TabsContent value="participants">
          <Card>
            <CardHeader>
              <CardTitle>participants</CardTitle>
              <CardDescription>
                liste des personnes ayant rejoint cette session de glanage
              </CardDescription>
            </CardHeader>
            <CardContent>
              {gleaning.participations.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  aucun participant pour ce glanage
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader className="bg-muted/50">
                      <TableRow>
                        <TableHead>utilisateur</TableHead>
                        <TableHead>email</TableHead>
                        <TableHead>date d'inscription</TableHead>
                        <TableHead>avis</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {gleaning.participations.map((participation: any) => {
                        const hasReviewed = gleaning.reviews.some(
                          (review: Review) =>
                            review.userId === participation.user.id,
                        );

                        return (
                          <TableRow key={participation.id}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Avatar className="size-8">
                                  <AvatarFallback>
                                    {participation.user.name?.slice(0, 2) ||
                                      participation.user.email.slice(0, 2)}
                                  </AvatarFallback>
                                  {participation.user.image && (
                                    <AvatarImage
                                      src={participation.user.image}
                                    />
                                  )}
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {participation.user.name || "-"}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>{participation.user.email}</TableCell>
                            <TableCell>
                              {formatDate(participation.createdAt)}
                            </TableCell>
                            <TableCell>
                              {hasReviewed ? (
                                <div className="flex items-center gap-1">
                                  <Star className="size-4 text-amber-500" />
                                  <span className="text-sm">
                                    a donné un avis
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  pas d'avis
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Liste des avis */}
        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>avis</CardTitle>
              <CardDescription>
                évaluations laissées par les participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              {gleaning.reviews.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  aucun avis pour ce glanage
                </div>
              ) : (
                <div className="space-y-6">
                  {gleaning.reviews.map(
                    (review: Review & { user: UserType }) => (
                      <div
                        key={review.id}
                        className="border rounded-md p-4 bg-card"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-10">
                              <AvatarFallback>
                                {review.user.name?.slice(0, 2) ||
                                  review.user.email.slice(0, 2)}
                              </AvatarFallback>
                              {review.user.image && (
                                <AvatarImage src={review.user.image} />
                              )}
                            </Avatar>
                            <div>
                              <div className="font-medium">
                                {review.user.name || review.user.email}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(review.createdAt)}
                              </div>
                            </div>
                          </div>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`size-4 ${
                                  i < review.rating
                                    ? "text-amber-500 fill-amber-500"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="mt-3 text-sm">
                          {review.content || (
                            <span className="text-muted-foreground italic">
                              pas de commentaire
                            </span>
                          )}
                        </div>

                        {/* Images de l'avis (si disponibles) */}
                        {review.images && review.images.length > 0 && (
                          <div className="mt-3 grid grid-cols-3 gap-2">
                            {review.images.map((image, index) => (
                              <div
                                key={index}
                                className="relative aspect-square h-auto w-full overflow-hidden rounded-md"
                              >
                                <Image
                                  src={image}
                                  alt={`Image ${index + 1} de l'avis`}
                                  fill
                                  sizes="33vw"
                                  className="object-cover"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
