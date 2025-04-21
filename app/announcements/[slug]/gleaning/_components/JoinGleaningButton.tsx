"use client";

import { Button } from "@/components/ui/button";
import { joinGleaningAction } from "../_actions/gleaning.action";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export type JoinGleaningButtonProps = {
  announcementId: string;
  slug: string;
  userIsParticipant?: boolean;
  className?: string;
};

export function JoinGleaningButton({
  announcementId,
  slug,
  userIsParticipant = false,
  className,
}: JoinGleaningButtonProps) {
  const router = useRouter();

  const { mutate: joinMutation, isPending } = useMutation({
    mutationFn: () =>
      resolveActionResult(joinGleaningAction({ announcementId })),
    onSuccess: (data) => {
      if (data.alreadyParticipating) {
        toast.info("vous participez déjà à ce glanage", {
          description: "vous pouvez voir les détails du glanage",
        });
      } else {
        toast.success("vous avez rejoint le glanage", {
          description: "vous êtes maintenant sur la liste des participants",
        });
      }

      if (data.success) {
        router.push(`/announcements/${slug}/gleaning`);
        router.refresh();
      }
    },
    onError: (error) => {
      toast.error("erreur", {
        description: error.message,
      });
    },
  });

  if (userIsParticipant) {
    return (
      <Button
        variant="secondary"
        className={className}
        onClick={() => router.push(`/announcements/${slug}/gleaning`)}
      >
        <Check className="size-4 mr-2" />
        voir le glanage
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      className={className}
      disabled={isPending}
      onClick={() => joinMutation()}
    >
      {isPending ? (
        "en cours..."
      ) : (
        <>
          <Users className="size-4 mr-2" />
          rejoindre le glanage
        </>
      )}
    </Button>
  );
}
