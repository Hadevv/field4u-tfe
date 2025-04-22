"use client";

import { useState, useEffect, useTransition, type ReactNode } from "react";
import { AnnouncementsTable } from "./AnnouncementsTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { CreateEditAnnouncementDialog } from "./CreateEditAnnouncementDialog";
import {
  Announcement,
  CropType,
  Field,
  User,
  Farm,
  Gleaning,
} from "@prisma/client";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileDown,
  RefreshCw,
  Filter,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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

type AnnouncementTableContainerProps = {
  initialAnnouncements: AnnouncementWithRelations[];
  page: number;
  totalPages: number;
  search?: string;
  status?: string;
  createButtonSlot?: ReactNode;
  fields: FieldWithRelations[];
  cropTypes: CropType[];
  users: User[];
};

export function AnnouncementTableContainer({
  initialAnnouncements,
  page,
  totalPages,
  search = "",
  status = "all",
  createButtonSlot,
  fields,
  cropTypes,
  users,
}: AnnouncementTableContainerProps) {
  const [announcements, setAnnouncements] =
    useState<AnnouncementWithRelations[]>(initialAnnouncements);
  const [searchTerm, setSearchTerm] = useState(search);
  const [statusFilter, setStatusFilter] = useState(status);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setAnnouncements(initialAnnouncements);
  }, [initialAnnouncements]);

  useEffect(() => {
    setSearchTerm(search);
    setStatusFilter(status);
  }, [search, status]);

  const handleSearch = () => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (statusFilter !== "all") params.set("status", statusFilter);
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const statusLabels: Record<string, string> = {
    all: "tous les statuts",
    published: "publié",
    draft: "brouillon",
    active: "en cours",
    upcoming: "à venir",
    finished: "terminé",
    cancelled: "annulé",
  };

  const handleStatusChange = (value: string) => {
    console.log("Changement de statut:", value); // Pour debug
    setStatusFilter(value);
    startTransition(() => {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (value !== "all") params.set("status", value);
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (statusFilter !== "all") params.set("status", statusFilter);
      params.set("page", newPage.toString());
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleAnnouncementUpdated = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasFilters = searchTerm || statusFilter !== "all";

  return (
    <div className="space-y-6 w-full">
      <Card>
        <CardHeader className="p-4 md:p-6 pb-0 flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl text-accent-foreground">
              liste des annonces
            </CardTitle>
            <CardDescription>
              {totalPages > 0
                ? `${announcements.length} annonces affichées, page ${page}/${totalPages}`
                : "aucune annonce trouvée"}
            </CardDescription>
          </div>
          <div className="flex flex-row gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={handleRefresh}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="size-4 mr-2" />
              )}
              actualiser
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-9"
              onClick={() => {}}
            >
              <FileDown className="size-4 mr-2" />
              exporter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
              <div className="relative w-full sm:w-80">
                <Input
                  placeholder="rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
              </div>
              <div className="w-full sm:w-60">
                <Select value={statusFilter} onValueChange={handleStatusChange}>
                  <SelectTrigger className="h-9">
                    <div className="flex items-center gap-2">
                      <Filter className="size-4 text-muted-foreground" />
                      <SelectValue placeholder="filtrer par statut" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleSearch}
                size="sm"
                variant="default"
                className="h-9 bg-accent text-accent-foreground hover:bg-accent/90"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Search className="size-4" />
                )}
              </Button>
              {hasFilters && (
                <Button
                  onClick={clearFilters}
                  size="sm"
                  variant="ghost"
                  className="h-9"
                >
                  <X className="size-4 mr-2" />
                  effacer les filtres
                </Button>
              )}
            </div>
            <div className="flex justify-end shrink-0">
              <div onClick={() => setShowCreateDialog(true)}>
                {createButtonSlot}
              </div>
            </div>
          </div>

          {hasFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {searchTerm && (
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  recherche: {searchTerm}
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  statut:{" "}
                  {statusLabels[statusFilter as keyof typeof statusLabels]}
                </Badge>
              )}
            </div>
          )}

          <div className="rounded-md border">
            <AnnouncementsTable
              announcements={announcements}
              onAnnouncementDeleted={handleAnnouncementUpdated}
              onAnnouncementUpdated={handleAnnouncementUpdated}
              fields={fields}
              cropTypes={cropTypes}
              users={users}
            />
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t pt-4 mt-4">
              <div className="text-sm text-muted-foreground">
                page {page} sur {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1 || isPending}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages || isPending}
                >
                  suivant <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateEditAnnouncementDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onAnnouncementSaved={handleAnnouncementUpdated}
        fields={fields}
        cropTypes={cropTypes}
        users={users}
      />
    </div>
  );
}
