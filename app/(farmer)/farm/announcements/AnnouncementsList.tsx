import { prisma } from "@/lib/prisma";
import { requiredAuth } from "@/lib/auth/helper";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Eye,
  Pencil,
  Calendar,
  Clock,
  MapPin,
  Users,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { DeleteAnnouncementButton } from "./DeleteAnnouncementButton";
import { ToggleAnnouncementStatus } from "./ToggleAnnouncementStatus";

export async function AnnouncementsList() {
  const user = await requiredAuth();

  const announcements = await prisma.announcement.findMany({
    where: {
      ownerId: user.id,
    },
    include: {
      field: true,
      cropType: true,
      gleaning: {
        include: {
          participations: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
    },
    orderBy: [{ isPublished: "desc" }, { createdAt: "desc" }],
  });

  if (announcements.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">aucune annonce créée</h2>
        <p className="mt-2 text-muted-foreground">
          créez votre première annonce de glanage pour permettre aux glaneurs de
          venir récolter vos surplus
        </p>
        <div className="mt-6">
          <Button asChild size="sm">
            <Link href="/farm/announcements/new">
              <FileText className="mr-2 h-4 w-4" />
              créer une annonce
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {announcements.map((announcement) => {
        const participationCount =
          announcement.gleaning?.participations.length || 0;

        return (
          <Card
            key={announcement.id}
            className={
              !announcement.isPublished ? "border-dashed opacity-75" : ""
            }
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <span className="line-clamp-1">{announcement.title}</span>
                  {!announcement.isPublished && (
                    <Badge variant="outline" className="ml-2 font-normal">
                      brouillon
                    </Badge>
                  )}
                </CardTitle>

                <ToggleAnnouncementStatus
                  announcementId={announcement.id}
                  isPublished={announcement.isPublished}
                />
              </div>
              <CardDescription className="flex flex-wrap gap-2 mt-1">
                <span className="flex items-center">
                  <MapPin className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                  {announcement.field.name || announcement.field.city}
                </span>
                <span className="flex items-center">
                  <Calendar className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                  {announcement.startDate
                    ? format(announcement.startDate, "dd MMM yyyy", {
                        locale: fr,
                      })
                    : "pas de date définie"}
                </span>
                <span className="flex items-center">
                  <Users className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                  {participationCount} glaneur
                  {participationCount !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center">
                  <Heart className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                  {announcement._count.likes} like
                  {announcement._count.likes !== 1 ? "s" : ""}
                </span>
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-grow pb-2">
              <div className="flex flex-wrap gap-2">
                <Badge>{announcement.cropType.name}</Badge>
                {announcement.quantityAvailable && (
                  <Badge variant="outline">
                    {announcement.quantityAvailable} kg disponibles
                  </Badge>
                )}
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                {announcement.description}
              </p>
            </CardContent>

            <CardFooter className="flex justify-between border-t pt-4">
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/farm/announcements/${announcement.slug}`}>
                    <Eye className="mr-2 h-3.5 w-3.5" />
                    voir
                  </Link>
                </Button>

                <Button asChild variant="outline" size="sm">
                  <Link href={`/farm/announcements/${announcement.slug}/edit`}>
                    <Pencil className="mr-2 h-3.5 w-3.5" />
                    modifier
                  </Link>
                </Button>

                <DeleteAnnouncementButton
                  announcementId={announcement.id}
                  announcementTitle={announcement.title}
                />
              </div>

              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="mr-1 h-3.5 w-3.5" />
                créée le{" "}
                {format(announcement.createdAt, "dd MMM yyyy", { locale: fr })}
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
