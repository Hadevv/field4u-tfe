"use client";

import { useState, useEffect, useTransition, type ReactNode } from "react";
import { FieldsTable } from "./FieldsTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { CreateEditFieldDialog } from "./CreateEditFieldDialog";
import { Field, User, Farm } from "@prisma/client";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileDown,
  RefreshCw,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type FieldWithRelations = Field & {
  owner?: User | null;
  farm?: Farm | null;
};

type FieldTableContainerProps = {
  initialFields: FieldWithRelations[];
  page: number;
  totalPages: number;
  search?: string;
  createButtonSlot?: ReactNode;
  users: User[];
  farms: Farm[];
};

export function FieldTableContainer({
  initialFields,
  page,
  totalPages,
  search = "",
  createButtonSlot,
  users,
  farms,
}: FieldTableContainerProps) {
  const [fields, setFields] = useState<FieldWithRelations[]>(initialFields);
  const [searchTerm, setSearchTerm] = useState(search);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setFields(initialFields);
  }, [initialFields]);

  const handleSearch = () => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
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
      params.set("page", newPage.toString());
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleFieldUpdated = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <div className="space-y-6 w-full">
      <Card>
        <CardHeader className="p-4 md:p-6 pb-0 flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl text-accent-foreground">
              liste des champs
            </CardTitle>
            <CardDescription>
              {totalPages > 0
                ? `${fields.length} champs affichés, page ${page}/${totalPages}`
                : "aucun champ trouvé"}
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
            <div className="flex justify-end">
              <div onClick={() => setShowCreateDialog(true)}>
                {createButtonSlot}
              </div>
            </div>
          </div>

          <FieldsTable
            fields={fields}
            onFieldDeleted={handleFieldUpdated}
            onFieldUpdated={handleFieldUpdated}
            users={users}
            farms={farms}
          />

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

      <CreateEditFieldDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onFieldSaved={handleFieldUpdated}
        users={users}
        farms={farms}
      />
    </div>
  );
}
