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
import { deleteAnnouncementAction } from "../../../../app/admin/announcements/actions";
import { useMutation } from "@tanstack/react-query";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { toast } from "sonner";
import {
  type Announcement,
  type CropType,
  type Field,
  type User,
  type Farm,
  type Gleaning,
} from "@prisma/client";
import {
  Edit,
  MoreHorizontal,
  Trash2,
  Calendar,
  Eye,
  Users,
  MapPin,
  Tag,
  CheckCircle,
  XCircle,
  AlertCircle,
  CircleEllipsis,
  CalendarClock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { dialogManager } from "@/features/dialog-manager/dialog-manager-store";
import { CreateEditAnnouncementDialog } from "./CreateEditAnnouncementDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { getGleaningStatusInfo } from "@/lib/format/gleaningStatus";

type AnnouncementWithRelations = Announcement & {
  field: Field & {
    farm?: Farm | null;
    owner?: User | null;
  };
  cropType: CropType;
  owner: User;
  gleaning?: Gleaning | null;
};

type FieldWithRelations = Field & {
  farm?: Farm | null;
  owner?: User | null;
};

type AnnouncementsTableProps = {
  announcements: AnnouncementWithRelations[];
  onAnnouncementDeleted: () => void;
  onAnnouncementUpdated: () => void;
  fields: FieldWithRelations[];
  cropTypes: CropType[];
  users: User[];
};

export function AnnouncementsTable({
  announcements,
  onAnnouncementDeleted,
  onAnnouncementUpdated,
  fields,
  cropTypes,
  users,
}: AnnouncementsTableProps) {
  const [editAnnouncement, setEditAnnouncement] =
    useState<AnnouncementWithRelations | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return resolveActionResult(deleteAnnouncementAction({ id }));
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("annonce supprimée avec succès");
      onAnnouncementDeleted();
    },
  });

  const handleDeleteAnnouncement = (id: string, title: string) => {
    dialogManager.add({
      title: "supprimer l'annonce",
      description: `êtes-vous sûr de vouloir supprimer l'annonce "${title}" ? cette action supprimera également les glanages associés.`,
      confirmText: "SUPPRIMER",
      action: {
        label: "supprimer",
        onClick: () => {
          deleteMutation.mutate(id);
        },
      },
    });
  };

  const getStatusBadgeIcon = (status: string) => {
    switch (status) {
      case "CANCELLED":
        return <XCircle className="mr-1 size-3" />;
      case "COMPLETED":
        return <CheckCircle className="mr-1 size-3" />;
      case "IN_PROGRESS":
        return <CheckCircle className="mr-1 size-3" />;
      case "NOT_STARTED":
        return <Calendar className="mr-1 size-3" />;
      case "draft":
        return <CircleEllipsis className="mr-1 size-3" />;
      default:
        return <CircleEllipsis className="mr-1 size-3" />;
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "-";
    return format(new Date(date), "dd/MM/yyyy");
  };

  const getRelativeDate = (date: Date | null | undefined) => {
    if (!date) return "";

    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: fr,
      });
    } catch (error) {
      return "";
    }
  };

  return (
    <>
      <div className="overflow-auto max-h-[600px]">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0 z-10">
            <TableRow>
              <TableHead>titre</TableHead>
              <TableHead>statut</TableHead>
              <TableHead>localisation</TableHead>
              <TableHead>culture</TableHead>
              <TableHead>dates</TableHead>
              <TableHead>propriétaire</TableHead>
              <TableHead className="w-[60px]">actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  aucune annonce trouvée
                </TableCell>
              </TableRow>
            ) : (
              announcements.map((announcement) => {
                const statusInfo = getGleaningStatusInfo(
                  announcement.startDate,
                  announcement.endDate,
                  announcement.gleaning?.status,
                );

                let badgeClass = statusInfo.color;
                let label = statusInfo.label;
                let status = statusInfo.status;

                if (!announcement.isPublished) {
                  badgeClass = "bg-muted text-muted-foreground";
                  label = "brouillon";
                  status = "draft";
                }

                return (
                  <TableRow key={announcement.id} className="group">
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{announcement.title}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[250px]">
                          {announcement.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={badgeClass + " font-normal"}>
                        {getStatusBadgeIcon(status)}
                        {label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="mr-2 size-3.5 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs">
                            {announcement.field.city} (
                            {announcement.field.postalCode})
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {announcement.field.farm
                              ? announcement.field.farm.name
                              : announcement.field.owner?.name || "-"}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-normal">
                        <Tag className="mr-1 size-3" />
                        {announcement.cropType.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {announcement.startDate ? (
                          <div className="flex flex-col">
                            <div className="text-xs">
                              début: {formatDate(announcement.startDate)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {getRelativeDate(announcement.startDate)}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-muted-foreground">
                            pas de date de début
                          </div>
                        )}

                        {announcement.endDate && (
                          <div className="text-xs">
                            fin: {formatDate(announcement.endDate)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-muted text-muted-foreground font-normal">
                        {announcement.owner.name || announcement.owner.email}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setEditAnnouncement(announcement)}
                          >
                            <Edit className="mr-2 size-4" />
                            modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/announcements/${announcement.slug}`}
                              target="_blank"
                            >
                              <Eye className="mr-2 size-4" />
                              voir l'annonce
                            </Link>
                          </DropdownMenuItem>
                          {announcement.gleaning && (
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/admin/gleanings/${announcement.gleaning.id}`}
                              >
                                <Users className="mr-2 size-4" />
                                voir le glanage
                              </Link>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() =>
                              handleDeleteAnnouncement(
                                announcement.id,
                                announcement.title,
                              )
                            }
                          >
                            <Trash2 className="mr-2 size-4" />
                            supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      {editAnnouncement && (
        <CreateEditAnnouncementDialog
          announcement={editAnnouncement}
          open={!!editAnnouncement}
          onOpenChange={(open: boolean) => {
            if (!open) setEditAnnouncement(null);
          }}
          onAnnouncementSaved={() => {
            setEditAnnouncement(null);
            onAnnouncementUpdated();
          }}
          fields={fields}
          cropTypes={cropTypes}
          users={users}
        />
      )}
    </>
  );
}
