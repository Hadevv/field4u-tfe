"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { deleteAnnouncementAction } from "./delete-announcement.action";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { dialogManager } from "@/features/dialog-manager/dialog-manager-store";

type DeleteAnnouncementButtonProps = {
  announcementId: string;
  announcementTitle: string;
};

export function DeleteAnnouncementButton({
  announcementId,
  announcementTitle,
}: DeleteAnnouncementButtonProps) {
  const router = useRouter();

  const deleteAnnouncementMutation = useMutation({
    mutationFn: async () => {
      return resolveActionResult(deleteAnnouncementAction({ announcementId }));
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Annonce supprimée avec succès");
      router.refresh();
    },
  });

  const handleDelete = () => {
    dialogManager.add({
      title: "Supprimer l'annonce",
      description: `Êtes-vous sûr de vouloir supprimer l'annonce "${announcementTitle}" ? Cette action est irréversible.`,
      confirmText: "SUPPRIMER",
      action: {
        label: "Supprimer",
        onClick: () => {
          deleteAnnouncementMutation.mutate();
        },
      },
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-destructive hover:bg-destructive/10"
      onClick={handleDelete}
      disabled={deleteAnnouncementMutation.isPending}
    >
      <Trash2 className="mr-2 h-3.5 w-3.5" />
      Supprimer
    </Button>
  );
}
