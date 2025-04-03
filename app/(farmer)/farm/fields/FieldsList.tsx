import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, FileText, Pencil, Trash2, Leaf } from "lucide-react";
import Link from "next/link";
import { DeleteFieldButton } from "./DeleteFieldButton";

type FieldsListProps = {
  userId: string;
  farmIds: string[];
};

export async function FieldsList({ userId, farmIds }: FieldsListProps) {
  const fields = await prisma.field.findMany({
    where: {
      OR: [{ farmId: { in: farmIds } }, { ownerId: userId }],
    },
    include: {
      farm: true,
      announcement: {
        where: {
          isPublished: true,
        },
        take: 3,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (fields.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <MapPin className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Aucun champ enregistré</h2>
        <p className="mt-2 text-muted-foreground">
          Commencez par ajouter un champ pour pouvoir créer des annonces de
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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {fields.map((field) => (
        <Card key={field.id} className="flex flex-col">
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle className="flex items-start gap-2">
                <MapPin className="mt-1 h-4 w-4 flex-shrink-0 text-green-600" />
                <span className="line-clamp-1">
                  {field.name || `Champ à ${field.city}`}
                </span>
              </CardTitle>

              {field.farm && (
                <span className="text-xs text-muted-foreground">
                  {field.farm.name}
                </span>
              )}
            </div>
            <CardDescription>
              {field.city}, {field.postalCode}
              {field.surface && ` - ${field.surface.toFixed(2)} hectares`}
            </CardDescription>
          </CardHeader>

          <CardContent className="flex-grow pb-2">
            {field.announcement.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">Annonces liées:</p>
                <ul className="space-y-1">
                  {field.announcement.map((announcement) => (
                    <li
                      key={announcement.id}
                      className="flex items-center text-sm"
                    >
                      <Leaf className="mr-2 h-3.5 w-3.5 text-green-600" />
                      <Link
                        href={`/farm/announcements/${announcement.id}`}
                        className="line-clamp-1 text-gray-700 hover:text-green-700 hover:underline"
                      >
                        {announcement.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucune annonce liée à ce champ
              </p>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t pt-4">
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/farm/fields/${field.id}`}>
                  <Pencil className="mr-2 h-3.5 w-3.5" />
                  Modifier
                </Link>
              </Button>

              <DeleteFieldButton
                fieldId={field.id}
                fieldName={field.name || `Champ à ${field.city}`}
              />
            </div>

            <Button
              asChild
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Link href={`/farm/announcements/new?fieldId=${field.id}`}>
                <FileText className="mr-2 h-3.5 w-3.5" />
                Créer annonce
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
