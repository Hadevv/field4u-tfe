"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { joinGleaningAction } from "../_actions/gleaning.action";

interface JoinGleaningButtonProps {
  announcementId: string;
  slug: string;
}

export function JoinGleaningButton({
  announcementId,
  slug,
}: JoinGleaningButtonProps) {
  const router = useRouter();

  const joinMutation = useMutation({
    mutationFn: async () => {
      return resolveActionResult(joinGleaningAction({ announcementId }));
    },
    onSuccess: (data) => {
      toast.success("Vous avez rejoint le glanage avec succès!");
      router.push(`/announcements/${slug}/gleaning`);
    },
    onError: (error) => {
      toast.error(error.message || "Une erreur est survenue");
    },
  });

  return (
    <Button
      onClick={() => joinMutation.mutate()}
      disabled={joinMutation.isPending}
      className="bg-primary hover:bg-primary/90 text-secondary-foreground rounded-full px-6"
    >
      {joinMutation.isPending ? "En cours..." : "Participer au glanage"}
    </Button>
  );
}
