"use client";

import { Heart } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { toggleLikeAction } from "../_actions/like.action";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

type LikeButtonProps = {
  announcementId: string;
  initialLiked: boolean;
  likeCount?: number;
  className?: string;
};

export function LikeButton({
  announcementId,
  initialLiked,
  likeCount,
  className,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(Boolean(initialLiked));
  const [count, setCount] = useState(likeCount || 0);
  const pathname = usePathname() || "/";
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsLiked(Boolean(initialLiked));
  }, [initialLiked]);

  useEffect(() => {
    if (typeof likeCount === "number") {
      setCount(likeCount);
    }
  }, [likeCount]);

  const navigateToSignIn = () => {
    window.location.href = `/auth/signin?callbackUrl=${pathname}`;
  };

  const likeMutation = useMutation({
    mutationFn: async () => {
      return resolveActionResult(
        toggleLikeAction({
          announcementId,
        }),
      );
    },
    onSuccess: (data) => {
      setIsLiked(data.liked);
      setCount((prevCount) =>
        data.liked ? prevCount + 1 : Math.max(0, prevCount - 1),
      );

      if (data.liked) {
        toast.success("annonce likée");
      } else {
        toast.success("like retiré");
      }

      // Rafraîchir les données sans recharger la page en invalidant toutes les requêtes reliées
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["likes"] });
      queryClient.invalidateQueries({ queryKey: ["user-likes"] });
    },
    onError: (error) => {
      if (
        error.message?.includes("Session not found") ||
        error.message?.includes("Session is not valid") ||
        error.message?.toLowerCase().includes("auth")
      ) {
        toast.error("veuillez vous connecter pour liker cette annonce");

        // Utiliser un court délai pour permettre au toast de s'afficher
        setTimeout(navigateToSignIn, 1000);
      } else {
        toast.error("une erreur est survenue");
      }
    },
  });

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    likeMutation.mutate();
  };

  const showCount = typeof count === "number" && count > 0;

  return (
    <Button
      variant="outline"
      size={showCount ? "sm" : "icon"}
      className={cn(
        "bg-background border shadow-sm hover:bg-background/80 transition-all",
        isLiked
          ? "text-destructive hover:text-destructive/80 border-destructive/20"
          : "text-muted-foreground hover:text-foreground",
        showCount ? "pl-2.5 pr-3 h-10" : "w-10 h-10",
        className,
      )}
      onClick={handleLike}
      disabled={likeMutation.isPending}
    >
      <div className="flex items-center gap-1.5">
        <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
        {showCount && (
          <span
            className={cn(
              "text-xs font-medium",
              isLiked ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {count}
          </span>
        )}
      </div>
      <span className="sr-only">
        {isLiked ? "retirer le like" : "liker l'annonce"}
      </span>
    </Button>
  );
}
