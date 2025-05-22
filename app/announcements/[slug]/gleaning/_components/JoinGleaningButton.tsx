"use client";

import { joinGleaningAction } from "../_actions/gleaning.action";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { Check, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showAddToCalendarDialog } from "@/features/calendar/AddToCalendarButton";
import Link from "next/link";
import { useOpenSignInModal } from "@/lib/auth/open-signin-modal";

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
  const pathname = usePathname() || "/";
  const router = useRouter();
  const queryClient = useQueryClient();
  const openSignInModal = useOpenSignInModal();

  const navigateToSignIn = () => {
    window.location.href = `/auth/signin?callbackUrl=${pathname}`;
  };

  const navigateToGleaning = () => {
    try {
      router.push(`/announcements/${slug}/gleaning`);
    } catch {
      window.location.href = `/announcements/${slug}/gleaning`;
    }
  };

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

        // Invalider les requêtes pour forcer un rafraîchissement des données
        queryClient.invalidateQueries({ queryKey: ["announcements"] });
        queryClient.invalidateQueries({ queryKey: ["gleaning"] });
        queryClient.invalidateQueries({ queryKey: ["participation"] });

        // Attendre légèrement que les toasts soient affichés avant de naviguer
        setTimeout(navigateToGleaning, 300);
      }
    },
    onError: (error) => {
      if (
        error.message?.includes("Session not found") ||
        error.message?.includes("Session is not valid") ||
        error.message?.toLowerCase().includes("auth")
      ) {
        toast.error("veuillez vous connecter pour rejoindre le glanage");
        setTimeout(() => openSignInModal(), 1000);
      } else {
        toast.error("erreur", {
          description: error.message,
        });
      }
    },
  });

  if (userIsParticipant) {
    return (
      <Button variant="secondary" size="sm" className={className} asChild>
        <Link href={`/announcements/${slug}/gleaning`} prefetch>
          <Check className="size-5" />
          voir le glanage
        </Link>
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
