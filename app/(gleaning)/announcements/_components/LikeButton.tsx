"use client";

import { Heart } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { toggleLikeAction } from "../_actions/like.action";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface LikeButtonProps {
  announcementId: string;
  initialLiked: boolean;
}

export function LikeButton({ announcementId, initialLiked }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);

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
      if (data.liked) {
        toast.success("Annonce ajoutée à vos favoris");
      } else {
        toast.success("Annonce retirée de vos favoris");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Une erreur est survenue");
    },
  });

  const handleLike = () => {
    likeMutation.mutate();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute top-2 right-2 z-10 bg-white/80 backdrop-blur-sm hover:bg-white/90"
      onClick={handleLike}
      disabled={likeMutation.isPending}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-colors",
          isLiked ? "fill-red-500 text-red-500" : "text-slate-600",
        )}
      />
      <span className="sr-only">
        {isLiked ? "Retirer des favoris" : "Ajouter aux favoris"}
      </span>
    </Button>
  );
}
