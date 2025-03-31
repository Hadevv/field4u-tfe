"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { leaveGleaningAction } from "../_actions/gleaning.action";

interface GleaningActionsProps {
  gleaningId: string;
  isParticipant: boolean;
  slug: string;
}

export function GleaningActions({
  gleaningId,
  isParticipant,
  slug,
}: GleaningActionsProps) {
  const router = useRouter();

  const leaveMutation = useMutation({
    mutationFn: async () => {
      return resolveActionResult(leaveGleaningAction({ gleaningId }));
    },
    onSuccess: () => {
      toast.success("Votre participation a été annulée");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message || "Une erreur est survenue");
    },
  });

  if (!isParticipant) {
    return null;
  }

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        onClick={() => leaveMutation.mutate()}
        disabled={leaveMutation.isPending}
      >
        {leaveMutation.isPending ? "Annulation..." : "Annuler ma participation"}
      </Button>

      <Button>Confirmer ma présence</Button>
    </div>
  );
}
