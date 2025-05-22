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
import { useRef } from "react";

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
  const pathname = usePathname() || "/";
  const callbackUrl = encodeURIComponent(pathname);
  const signInUrl = `/auth/signin?callbackUrl=${callbackUrl}`;
  const linkRef = useRef<HTMLAnchorElement>(null);
  const gleaningLinkRef = useRef<HTMLAnchorElement>(null);
  const queryClient = useQueryClient();

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

        // Invalidate queries to refresh data without full page reload
        queryClient.invalidateQueries({ queryKey: ["announcements"] });
        queryClient.invalidateQueries({ queryKey: ["gleaning"] });

        // Navigate to gleaning page
        setTimeout(() => {
          if (gleaningLinkRef.current) {
            gleaningLinkRef.current.click();
          }
        }, 500);
      }
    },
    onError: (error) => {
      if (
        error.message?.includes("Session not found") ||
        error.message?.includes("Session is not valid") ||
        error.message?.toLowerCase().includes("auth")
      ) {
        toast.error("veuillez vous connecter pour rejoindre le glanage");

        // Redirection vers la page de connexion avec le callback correct
        setTimeout(() => {
          if (linkRef.current) {
            linkRef.current.click();
          }
        }, 1000);
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
        <Link href={`/announcements/${slug}/gleaning`} prefetch={false}>
          <Check className="size-5" />
          voir le glanage
        </Link>
      </Button>
    );
  }

  return (
    <>
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
      {/* Liens de navigation cachés */}
      <Link
        ref={gleaningLinkRef}
        href={`/announcements/${slug}/gleaning`}
        className="hidden"
        prefetch={false}
      />
      <Link
        ref={linkRef}
        href={signInUrl}
        className="hidden"
        replace={false}
        prefetch={false}
      />
    </>
  );
}
