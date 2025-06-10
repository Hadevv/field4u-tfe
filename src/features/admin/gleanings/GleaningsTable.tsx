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
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { GleaningStatus } from "@prisma/client";
import {
  MoreHorizontal,
  Edit,
  Eye,
  Star,
  CheckCircle,
  XCircle,
  CircleEllipsis,
  Calendar,
  MapPin,
  User,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getGleaningStatusInfo } from "@/lib/format/gleaningStatus";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type GleaningWithDetails = {
  id: string;
  status: GleaningStatus;
  createdAt: Date;
  announcement: {
    id: string;
    title: string;
    slug: string;
    startDate?: Date | null;
    endDate?: Date | null;
    owner: {
      id: string;
      name: string | null;
      image: string | null;
    };
    field: {
      id: string;
      city: string;
      postalCode: string;
    };
    cropType: {
      id: string;
      name: string;
    };
  };
  participations: {
    id: string;
    user: {
      id: string;
      name: string | null;
      image: string | null;
    };
  }[];
  _count: {
    participations: number;
    reviews: number;
  };
};

type GleaningsTableProps = {
  gleanings: GleaningWithDetails[];
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
    case "à venir":
      return <Calendar className="mr-1 size-3" />;
    default:
      return <CircleEllipsis className="mr-1 size-3" />;
  }
};

export function GleaningsTable({ gleanings }: GleaningsTableProps) {
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "-";
    return format(date, "dd MMM yyyy", { locale: fr });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>annonce</TableHead>
            <TableHead>statut</TableHead>
            <TableHead>agriculteur</TableHead>
            <TableHead>localisation</TableHead>
            <TableHead>dates</TableHead>
            <TableHead>participants</TableHead>
            <TableHead>avis</TableHead>
            <TableHead className="w-[60px]">actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gleanings.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center text-muted-foreground"
              >
                aucun glanage trouvé
              </TableCell>
            </TableRow>
          ) : (
            gleanings.map((gleaning) => {
              const statusInfo = getGleaningStatusInfo(
                gleaning.announcement.startDate,
                gleaning.announcement.endDate,
                gleaning.status,
              );

              return (
                <TableRow key={gleaning.id} className="group">
                  <TableCell>
                    <Link
                      href={`/announcements/${gleaning.announcement.slug}`}
                      className="font-medium text-foreground hover:underline"
                    >
                      {gleaning.announcement.title}
                    </Link>
                    <div className="text-xs text-muted-foreground mt-1">
                      {gleaning.announcement.cropType.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusInfo.color + " font-normal"}>
                      {getStatusBadgeIcon(statusInfo.status)}
                      {statusInfo.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6">
                        <AvatarFallback className="text-xs">
                          {gleaning.announcement.owner.name?.slice(0, 2) || "?"}
                        </AvatarFallback>
                        {gleaning.announcement.owner.image && (
                          <AvatarImage
                            src={gleaning.announcement.owner.image}
                          />
                        )}
                      </Avatar>
                      <span className="text-sm">
                        {gleaning.announcement.owner.name || "-"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="flex items-start gap-1 text-muted-foreground">
                      <MapPin className="size-3.5 mt-0.5 flex-shrink-0" />
                      <span>
                        {gleaning.announcement.field.city}
                        <span className="text-xs ml-1">
                          ({gleaning.announcement.field.postalCode})
                        </span>
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">
                    {gleaning.announcement.startDate &&
                    gleaning.announcement.endDate ? (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="size-3.5" />
                          <span>
                            {formatDate(gleaning.announcement.startDate)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Calendar className="size-3.5" />
                          <span>
                            {formatDate(gleaning.announcement.endDate)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">
                        non planifié
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="size-4 text-muted-foreground" />
                      <span>{gleaning._count.participations}</span>

                      {gleaning._count.participations > 0 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex -space-x-2 ml-2">
                                {gleaning.participations
                                  .slice(0, 3)
                                  .map((p) => (
                                    <Avatar
                                      key={p.id}
                                      className="size-6 border-2 border-background"
                                    >
                                      <AvatarFallback className="text-xs">
                                        {p.user.name?.slice(0, 2) || "?"}
                                      </AvatarFallback>
                                      {p.user.image && (
                                        <AvatarImage src={p.user.image} />
                                      )}
                                    </Avatar>
                                  ))}
                                {gleaning._count.participations > 3 && (
                                  <div className="size-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                                    +{gleaning._count.participations - 3}
                                  </div>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>voir tous les participants</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="size-4 text-amber-500" />
                      <span>{gleaning._count.reviews}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/gleanings/${gleaning.id}`}>
                            <Eye className="mr-2 size-4" />
                            voir les détails
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/announcements/${gleaning.announcement.slug}`}
                            target="_blank"
                          >
                            <Edit className="mr-2 size-4" />
                            voir l'annonce
                          </Link>
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
  );
}
