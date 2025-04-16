import { prisma } from "@/lib/prisma";
import { DeleteFieldButton } from "./DeleteFieldButton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistance, format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FileText,
  MapPin,
  Calendar,
  Ruler,
  Clock,
  Eye,
  Pencil,
} from "lucide-react";

type FieldsListProps = {
  userId: string;
  farmId: string;
};

export async function FieldsList({ userId, farmId }: FieldsListProps) {
  const fields = await prisma.field.findMany({
    where: {
      OR: [{ ownerId: userId }, { farmId: farmId }],
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      farm: {
        select: {
          name: true,
        },
      },
      announcement: {
        select: {
          id: true,
        },
      },
    },
  });

  if (fields.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Aucun champ trouvé</h2>
        <p className="mt-2 text-muted-foreground">
          Ajoutez votre premier champ pour commencer à créer des annonces de
          glanage.
        </p>
        <div className="mt-6">
          <Button asChild>
            <Link href="/farm/fields/new">
              <MapPin className="mr-2 h-4 w-4" />
              Ajouter un champ
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <Card key={field.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <span className="line-clamp-1">
                  {field.name || "Champ sans nom"}
                </span>
              </CardTitle>
            </div>
            <CardDescription className="flex flex-wrap gap-2 mt-1">
              <span className="flex items-center">
                <MapPin className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                {field.city}, {field.postalCode}
              </span>
              <span className="flex items-center">
                <Ruler className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
                {field.surface
                  ? `${field.surface} hectares`
                  : "Surface non définie"}
              </span>
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-grow pb-2">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={field.announcement.length > 0 ? "default" : "outline"}
              >
                {field.announcement.length} annonce
                {field.announcement.length !== 1 ? "s" : ""}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Lat: {field.latitude.toFixed(4)}, Long:{" "}
                {field.longitude.toFixed(4)}
              </Badge>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-4">
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/farm/fields/${field.id}`}>
                  <Eye className="mr-2 h-3.5 w-3.5" />
                  Voir
                </Link>
              </Button>

              <Button asChild variant="outline" size="sm">
                <Link href={`/farm/announcements/new?fieldId=${field.id}`}>
                  <FileText className="mr-2 h-3.5 w-3.5" />
                  Créer une annonce
                </Link>
              </Button>

              <DeleteFieldButton
                fieldId={field.id}
                hasAnnouncements={field.announcement.length > 0}
              />
            </div>

            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="mr-1 h-3.5 w-3.5" />
              Ajouté le {format(field.createdAt, "dd MMM yyyy", { locale: fr })}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
