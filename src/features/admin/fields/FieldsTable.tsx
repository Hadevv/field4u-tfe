"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { deleteFieldAction } from "../../../../app/admin/fields/actions";
import { useMutation } from "@tanstack/react-query";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { toast } from "sonner";
import { type Field, type User, type Farm } from "@prisma/client";
import {
  Edit,
  MoreHorizontal,
  Trash2,
  MapPin,
  Scroll,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { dialogManager } from "@/features/dialog-manager/dialog-manager-store";
import { CreateEditFieldDialog } from "./CreateEditFieldDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

type FieldWithRelations = Field & {
  owner?: User | null;
  farm?: Farm | null;
};

type FieldsTableProps = {
  fields: FieldWithRelations[];
  onFieldDeleted: () => void;
  onFieldUpdated: () => void;
  users: User[];
  farms: Farm[];
};

export function FieldsTable({
  fields,
  onFieldDeleted,
  onFieldUpdated,
  users,
  farms,
}: FieldsTableProps) {
  const [editField, setEditField] = useState<FieldWithRelations | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return resolveActionResult(deleteFieldAction({ id }));
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("champ supprimé avec succès");
      onFieldDeleted();
    },
  });

  const handleDeleteField = (id: string, name: string) => {
    dialogManager.add({
      title: "supprimer le champ",
      description: `êtes-vous sûr de vouloir supprimer le champ "${name}" ?`,
      confirmText: "SUPPRIMER",
      action: {
        label: "supprimer",
        onClick: () => {
          deleteMutation.mutate(id);
        },
      },
    });
  };

  const formatSurface = (surface: number | null) => {
    if (!surface) return "-";
    return `${surface} ha`;
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>nom</TableHead>
              <TableHead>localisation</TableHead>
              <TableHead>coordonnées</TableHead>
              <TableHead>surface</TableHead>
              <TableHead>propriétaire</TableHead>
              <TableHead className="w-[60px]">actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fields.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  aucun champ trouvé
                </TableCell>
              </TableRow>
            ) : (
              fields.map((field) => (
                <TableRow key={field.id} className="group">
                  <TableCell className="font-medium">
                    {field.name || "-"}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="mr-2 size-3.5 mt-0.5 flex-shrink-0" />
                      <span className="text-xs">
                        {field.city} ({field.postalCode})
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="mr-2 size-3.5 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">
                        {field.latitude.toFixed(6)},{" "}
                        {field.longitude.toFixed(6)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {formatSurface(field.surface)}
                  </TableCell>
                  <TableCell>
                    {field.farm ? (
                      <Badge
                        variant="outline"
                        className="bg-accent/10 text-accent-foreground font-normal"
                      >
                        {field.farm.name}
                      </Badge>
                    ) : field.owner ? (
                      <Badge className="bg-muted text-muted-foreground font-normal">
                        {field.owner.name || field.owner.email}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditField(field)}>
                          <Edit className="mr-2 size-4" />
                          modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Scroll className="mr-2 size-4" />
                          voir les annonces
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="mr-2 size-4" />
                          voir les glanages
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() =>
                            handleDeleteField(field.id, field.name || "")
                          }
                        >
                          <Trash2 className="mr-2 size-4" />
                          supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {editField && (
        <CreateEditFieldDialog
          field={editField}
          open={!!editField}
          onOpenChange={(open: boolean) => {
            if (!open) setEditField(null);
          }}
          onFieldSaved={() => {
            setEditField(null);
            onFieldUpdated();
          }}
          users={users}
          farms={farms}
        />
      )}
    </>
  );
}
