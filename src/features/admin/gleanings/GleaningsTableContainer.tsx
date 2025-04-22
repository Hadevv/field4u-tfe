/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect, useTransition, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  FileDown,
  X,
  Filter,
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
import { GleaningsTable } from "./GleaningsTable";

type GleaningsTableContainerProps = {
  initialGleanings: any[];
  page: number;
  totalPages: number;
  search?: string;
  status?: string;
};

export function GleaningsTableContainer({
  initialGleanings,
  page,
  totalPages,
  search = "",
  status = "",
}: GleaningsTableContainerProps) {
  const [gleanings, setGleanings] = useState<any[]>(initialGleanings);
  const [searchTerm, setSearchTerm] = useState(search);
  const [statusFilter, setStatusFilter] = useState<string>(status || "");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setGleanings(initialGleanings);
  }, [initialGleanings]);

  useEffect(() => {
    setSearchTerm(search);
    setStatusFilter(status || "");
  }, [search, status]);

  const handleSearch = () => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (statusFilter) params.set("status", statusFilter);
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (statusFilter) params.set("status", statusFilter);
      params.set("page", newPage.toString());
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value === "ALL" ? "" : value);
    startTransition(() => {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (value !== "ALL") params.set("status", value);
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasFilters = searchTerm || statusFilter;

  return (
    <div className="space-y-6 w-full">
      <Card>
        <CardHeader className="p-4 md:p-6 pb-0 flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl text-accent-foreground">
              liste des glanages
            </CardTitle>
            <CardDescription>
              {totalPages > 0
                ? `${gleanings.length} glanages affichés, page ${page}/${totalPages}`
                : "aucun glanage trouvé"}
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
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center w-full sm:w-auto space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="flex items-center w-full sm:w-80 space-x-2">
                <Input
                  placeholder="rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-9"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch();
                  }}
                />
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
              </div>
              <Select
                value={statusFilter || "ALL"}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-full sm:w-[180px] h-9">
                  <div className="flex items-center gap-2">
                    <Filter className="size-4 text-muted-foreground" />
                    <SelectValue placeholder="filtrer par statut" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">tous les statuts</SelectItem>
                  <SelectItem value="NOT_STARTED">non commencé</SelectItem>
                  <SelectItem value="IN_PROGRESS">en cours</SelectItem>
                  <SelectItem value="COMPLETED">terminé</SelectItem>
                  <SelectItem value="CANCELLED">annulé</SelectItem>
                </SelectContent>
              </Select>
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
          </div>

          <div className="rounded-md border">
            <GleaningsTable gleanings={gleanings} />
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
    </div>
  );
}
