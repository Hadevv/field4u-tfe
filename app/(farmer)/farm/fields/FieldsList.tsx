import { prisma } from "@/lib/prisma";
import { DeleteFieldButton } from "./DeleteFieldButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type FieldsListProps = {
  userId: string;
  farmId: string;
};

export async function FieldsList({ userId, farmId }: FieldsListProps) {
  // Récupérer tous les champs appartenant à l'utilisateur
  // ou à des fermes dont l'utilisateur est propriétaire
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

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-green-50">
            <TableHead>Nom</TableHead>
            <TableHead>Localisation</TableHead>
            <TableHead>Surface</TableHead>
            <TableHead>Annonces</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fields.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                Aucun champ trouvé. Ajoutez votre premier champ pour commencer.
              </TableCell>
            </TableRow>
          ) : (
            fields.map((field) => (
              <TableRow key={field.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col">
                    <span>{field.name || "Champ sans nom"}</span>
                    <span className="text-xs text-muted-foreground">
                      Ajouté il y a{" "}
                      {formatDistance(new Date(field.createdAt), new Date(), {
                        addSuffix: false,
                        locale: fr,
                      })}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>
                      {field.city}, {field.postalCode}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Lat: {field.latitude.toFixed(4)}, Long:{" "}
                      {field.longitude.toFixed(4)}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  {field.surface ? `${field.surface} hectares` : "-"}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      field.announcement.length > 0 ? "default" : "outline"
                    }
                    className={
                      field.announcement.length > 0
                        ? "bg-green-100 text-green-800 hover:bg-green-200"
                        : "text-muted-foreground"
                    }
                  >
                    {field.announcement.length} annonce
                    {field.announcement.length !== 1 ? "s" : ""}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild className="h-8">
                      <Link
                        href={`/farm/announcements/new?fieldId=${field.id}`}
                      >
                        Créer une annonce
                      </Link>
                    </Button>
                    <DeleteFieldButton
                      fieldId={field.id}
                      hasAnnouncements={field.announcement.length > 0}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
