"use client";

import { joinGleaningAction } from "../_actions/gleaning.action";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Check, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showAddToCalendarDialog } from "@/features/calendar/AddToCalendarButton";

export type JoinGleaningButtonProps = {
  announcementId: string;
  slug: string;
  userIsParticipant?: boolean;
  className?: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
};

export function JoinGleaningButton({
  announcementId,
  slug,
  userIsParticipant = false,
  className,
  title,
  description,
  startDate,
  endDate,
  location,
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
        const calendarKey = `calendar-modal-shown-${announcementId}`;
        if (
          typeof window !== "undefined" &&
          !localStorage.getItem(calendarKey)
        ) {
          localStorage.setItem(calendarKey, "1");
          showAddToCalendarDialog({
            announcementId,
            title,
            description,
            startDate,
            endDate,
            location,
          });
        }
        router.push(`/announcements/${slug}/gleaning`);
        router.refresh();
      }
    },
    onError: (error) => {
      if (
        error.message?.includes("Session not found") ||
        error.message?.includes("Session is not valid") ||
        error.message?.toLowerCase().includes("auth")
      ) {
        toast.error("veuillez vous connecter pour rejoindre le glanage");
        router.push(`/auth/signin?callbackUrl=/announcements/${slug}`);
      } else {
        toast.error("erreur", {
          description: error.message,
        });
      }
    },
  });

  if (userIsParticipant) {
    return (
      <Button
        variant="secondary"
        size="sm"
        className={className}
        onClick={() => router.push(`/announcements/${slug}/gleaning`)}
      >
        <Check className="size-5" />
        voir le glanage
      </Button>
    );
  }

  return (
    <Button
      variant="secondary"
      size="sm"
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
