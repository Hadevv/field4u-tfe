"use client";

import { Switch } from "@/components/ui/switch";
import { useMutation } from "@tanstack/react-query";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { toggleAnnouncementStatusAction } from "./toggle-announcement-status.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ToggleAnnouncementStatusProps = {
  announcementId: string;
  isPublished: boolean;
};

export function ToggleAnnouncementStatus({
  announcementId,
  isPublished,
}: ToggleAnnouncementStatusProps) {
  const router = useRouter();

  const toggleStatusMutation = useMutation({
    mutationFn: async (newStatus: boolean) => {
      return resolveActionResult(
        toggleAnnouncementStatusAction({
          announcementId,
          isPublished: newStatus,
        }),
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(
        data.announcement.isPublished
          ? "Annonce publiée avec succès"
          : "Annonce mise en brouillon",
      );
      router.refresh();
    },
  });

  const handleToggle = (checked: boolean) => {
    toggleStatusMutation.mutate(checked);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground mr-1">
        {isPublished ? "Publiée" : "Brouillon"}
      </span>
      <Switch
        checked={isPublished}
        onCheckedChange={handleToggle}
        disabled={toggleStatusMutation.isPending}
        className="data-[state=checked]:bg-green-600"
      />
    </div>
  );
}
