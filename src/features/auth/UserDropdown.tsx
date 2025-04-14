"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader } from "@/components/ui/loader";
import { Typography } from "@/components/ui/typography";
import { useMutation } from "@tanstack/react-query";
import { LayoutDashboard, LogOut, Settings, Tractor } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const UserDropdown = ({ children }: PropsWithChildren) => {
  const logout = useMutation({
    mutationFn: () => signOut({ callbackUrl: "/" }),
  });
  const session = useSession();
  const userRole = session.data?.user?.role;
  const [hasCheckedLinking, setHasCheckedLinking] = useState(false);

  useEffect(() => {
    if (session.status === "authenticated" && !hasCheckedLinking) {
      setHasCheckedLinking(true);

      // verifier le localStorage pour voir si c'est la premiere connexion
      const lastEmail = localStorage.getItem("lastLoginEmail");
      const currentEmail = session.data.user.email;

      // si lemail est différent ou n'existe pas encore, l'utilisateur se connecte pour la première fois
      if (lastEmail !== currentEmail) {
        localStorage.setItem("lastLoginEmail", currentEmail);

        // verifier les providers liés au compte
        fetch("/api/auth/linked-providers")
          .then((res) => res.json())
          .then((providers) => {
            if (providers && providers.length > 1) {
              toast.success(
                "comptes liés détectés! vous pouvez vous connecter avec n'importe quel provider.",
              );
            }
          })
          .catch(() => {});
      }
    }
  }, [session.status, session.data, hasCheckedLinking]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>
          <Typography variant="small">{session.data?.user.name}</Typography>
          <Typography variant="muted">{session.data?.user.email}</Typography>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <Settings className="mr-2 size-4" />
            Mon compte
          </Link>
        </DropdownMenuItem>

        {userRole === "ADMIN" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin/dashboard">
                <LayoutDashboard className="mr-2 size-4" />
                Dashboard
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {userRole === "FARMER" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/farm">
                <Tractor className="mr-2 size-4" />
                Mon exploitation
              </Link>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              logout.mutate();
            }}
          >
            {logout.isPending ? (
              <Loader className="mr-2 size-4" />
            ) : (
              <LogOut className="mr-2 size-4" />
            )}
            <span>Déconnexion</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
