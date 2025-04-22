"use client";

import { useState, useEffect, useTransition, type ReactNode } from "react";
import { UsersTable } from "./UsersTable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { CreateEditUserDialog } from "./CreateEditUserDialog";
import { User, UserRole } from "@prisma/client";
import { exportToExcel } from "@/lib/export/table-export";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileDown,
  RefreshCw,
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

const roleLabels: Record<UserRole | "ALL", string> = {
  ALL: "tous les rôles",
  ADMIN: "administrateur",
  FARMER: "agriculteur",
  GLEANER: "glaneur",
};

type UserTableContainerProps = {
  initialUsers: User[];
  page: number;
  totalPages: number;
  search?: string;
  role?: string;
  createButtonSlot?: ReactNode;
};

export function UserTableContainer({
  initialUsers,
  page,
  totalPages,
  search = "",
  role = "ALL",
  createButtonSlot,
}: UserTableContainerProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState(search);
  const [roleFilter, setRoleFilter] = useState<string>(role);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setUsers(initialUsers);
  }, [initialUsers]);

  const handleSearch = () => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (roleFilter && roleFilter !== "ALL") params.set("role", roleFilter);
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
      if (roleFilter && roleFilter !== "ALL") params.set("role", roleFilter);
      params.set("page", newPage.toString());
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleUserUpdated = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  const handleRoleChange = (value: string) => {
    setRoleFilter(value);
    startTransition(() => {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (value && value !== "ALL") params.set("role", value);
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleExport = () => {
    const excludedFields = [
      "hashedPassword",
      "stripeCustomerId",
      "resendContactId",
    ];
    const customHeaders = {
      id: "ID",
      name: "nom",
      email: "email",
      role: "rôle",
      createdAt: "date création",
      city: "ville",
      postalCode: "code postal",
      emailVerified: "email vérifié",
      onboardingCompleted: "onboarding complété",
    };

    exportToExcel(users, "users-export", excludedFields, customHeaders);
  };

  return (
    <div className="space-y-6 w-full">
      <Card>
        <CardHeader className="p-4 md:p-6 pb-0 flex flex-row flex-wrap items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl text-accent-foreground">
              liste des utilisateurs
            </CardTitle>
            <CardDescription>
              {totalPages > 0
                ? `${users.length} utilisateurs affichés, page ${page}/${totalPages}`
                : "aucun utilisateur trouvé"}
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
              onClick={handleExport}
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
              <Select value={roleFilter} onValueChange={handleRoleChange}>
                <SelectTrigger className="w-full sm:w-[180px] h-9">
                  <SelectValue placeholder="filtrer par rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">tous les rôles</SelectItem>
                  <SelectItem value="ADMIN">administrateur</SelectItem>
                  <SelectItem value="FARMER">agriculteur</SelectItem>
                  <SelectItem value="GLEANER">glaneur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <div onClick={() => setShowCreateDialog(true)}>
                {createButtonSlot}
              </div>
            </div>
          </div>

          <UsersTable
            users={users}
            onUserDeleted={handleUserUpdated}
            onUserUpdated={handleUserUpdated}
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

      <CreateEditUserDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onUserSaved={handleUserUpdated}
      />
    </div>
  );
}
