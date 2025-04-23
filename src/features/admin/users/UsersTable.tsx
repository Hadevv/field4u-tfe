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
import { deleteUserAction } from "../../../../app/admin/users/actions";
import { useMutation } from "@tanstack/react-query";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { toast } from "sonner";
import { UserRole, UserPlan, Language, type User } from "@prisma/client";
import { Edit, MoreHorizontal, Trash2, UserCog, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { dialogManager } from "@/features/dialog-manager/dialog-manager-store";
import { CreateEditUserDialog } from "./CreateEditUserDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const roleLabels: Record<UserRole, string> = {
  ADMIN: "administrateur",
  FARMER: "agriculteur",
  GLEANER: "glaneur",
};

const roleBadgeVariants: Record<UserRole, string> = {
  ADMIN: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
  FARMER: "bg-muted text-muted-foreground hover:bg-muted/80",
  GLEANER: "bg-accent text-accent-foreground hover:bg-accent/80",
};

const planLabels: Record<UserPlan, string> = {
  FREE: "gratuit",
  PREMIUM: "premium",
};

const languageLabels: Record<Language, string> = {
  FRENCH: "français",
  ENGLISH: "anglais",
  DUTCH: "néerlandais",
};

type UsersTableProps = {
  users: User[];
  onUserDeleted: () => void;
  onUserUpdated: () => void;
};

export function UsersTable({
  users,
  onUserDeleted,
  onUserUpdated,
}: UsersTableProps) {
  const [editUser, setEditUser] = useState<User | null>(null);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return resolveActionResult(deleteUserAction({ id }));
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("utilisateur supprimé avec succès");
      onUserDeleted();
    },
  });

  const handleDeleteUser = (userId: string, userName: string) => {
    dialogManager.add({
      title: "supprimer l'utilisateur",
      description: `êtes-vous sûr de vouloir supprimer l'utilisateur ${userName || userId} ? cette action est irréversible.`,
      confirmText: "SUPPRIMER",
      action: {
        label: "supprimer",
        onClick: () => {
          deleteMutation.mutate(userId);
        },
      },
    });
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>utilisateur</TableHead>
              <TableHead>email</TableHead>
              <TableHead>rôle</TableHead>
              <TableHead>abonnement</TableHead>
              <TableHead>langue</TableHead>
              <TableHead>localisation</TableHead>
              <TableHead className="w-[60px]">actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8">
                        <AvatarFallback className="bg-accent text-accent-foreground">
                          {user.name?.slice(0, 2) || user.email.slice(0, 2)}
                        </AvatarFallback>
                        {user.image && <AvatarImage src={user.image} />}
                      </Avatar>
                      <div className="font-medium">{user.name || "-"}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{user.email}</TableCell>
                  <TableCell>
                    <Badge className={roleBadgeVariants[user.role]}>
                      {roleLabels[user.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.plan === "PREMIUM" ? "outline" : "outline"}
                      className="text-xs"
                    >
                      {planLabels[user.plan]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {languageLabels[user.language]}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.city
                      ? `${user.city}${user.postalCode ? ` (${user.postalCode})` : ""}`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditUser(user)}>
                          <Edit className="mr-2 size-4" />
                          modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <UserCog className="mr-2 size-4" />
                          gérer les fermes
                        </DropdownMenuItem>
                        {user.role === UserRole.FARMER && (
                          <DropdownMenuItem asChild>
                            <Link href={`/farm/details`}>
                              <Eye className="mr-2 size-4" />
                              voir la ferme
                            </Link>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() =>
                            handleDeleteUser(user.id, user.name || user.email)
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

      {editUser && (
        <CreateEditUserDialog
          user={editUser}
          open={!!editUser}
          onOpenChange={(open: boolean) => {
            if (!open) setEditUser(null);
          }}
          onUserSaved={() => {
            setEditUser(null);
            onUserUpdated();
          }}
        />
      )}
    </>
  );
}
