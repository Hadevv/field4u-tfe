"use client";

import { Star } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { toggleFavoriteAction } from "../_actions/favorite.action";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState, useEffect, useTransition, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";

type FavoriteButtonProps = {
  announcementId: string;
  initialFavorited: boolean;
  className?: string;
};

export function FavoriteButton({
  announcementId,
  initialFavorited,
  className,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(Boolean(initialFavorited));
  const router = useRouter();
  const pathname = usePathname() || "/";
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsFavorited(Boolean(initialFavorited));
  }, [initialFavorited]);

  const navigateToSignIn = useCallback(() => {
    const callbackUrl = encodeURIComponent(pathname);
    startTransition(() => {
      router.push(`/auth/signin?callbackUrl=${callbackUrl}`);
    });
  }, [pathname, router]);

  const refreshPage = useCallback(() => {
    startTransition(() => {
      router.refresh();
    });
  }, [router]);

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      return resolveActionResult(
        toggleFavoriteAction({
          announcementId,
        }),
      );
    },
    onSuccess: (data) => {
      setIsFavorited(data.favorited);
      if (data.favorited) {
        toast.success("ajouté aux favoris");
      } else {
        toast.success("retiré des favoris");
      }

      refreshPage();
    },
    onError: (error) => {
      // vérifier si l'erreur est liée à l'authentification
      if (
        error.message?.includes("Session not found") ||
        error.message?.includes("Session is not valid") ||
        error.message?.toLowerCase().includes("auth")
      ) {
        toast.error("veuillez vous connecter pour ajouter aux favoris");
        navigateToSignIn();
      } else {
        toast.error("une erreur est survenue");
      }
    },
  });

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    favoriteMutation.mutate();
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "w-10 h-10 bg-background border shadow-sm hover:bg-background/80",
        isFavorited
          ? "text-yellow-500 hover:text-yellow-600 border-yellow-200"
          : "text-muted-foreground hover:text-foreground",
        className,
      )}
      onClick={handleFavorite}
      disabled={favoriteMutation.isPending || isPending}
    >
      <Star className={cn("w-4 h-4", isFavorited && "fill-current")} />
      <span className="sr-only">
        {isFavorited ? "retirer des favoris" : "ajouter aux favoris"}
      </span>
    </Button>
  );
}
