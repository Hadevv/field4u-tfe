"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { deleteFieldAction } from "./delete-field.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { dialogManager } from "@/features/dialog-manager/dialog-manager-store";

type DeleteFieldButtonProps = {
  fieldId: string;
  hasAnnouncements?: boolean;
};

export function DeleteFieldButton({
  fieldId,
  hasAnnouncements = false,
}: DeleteFieldButtonProps) {
  const router = useRouter();

  const deleteFieldMutation = useMutation({
    mutationFn: async () => {
      return resolveActionResult(deleteFieldAction({ fieldId }));
    },
    onSuccess: () => {
      toast.success("Champ supprimé avec succès");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDeleteClick = () => {
    dialogManager.add({
      title: "Supprimer le champ",
      description: hasAnnouncements
        ? "Ce champ est associé à des annonces. Êtes-vous sûr de vouloir supprimer ce champ ? Cette action supprimera également toutes les annonces associées."
        : "Êtes-vous sûr de vouloir supprimer ce champ ?",
      confirmText: hasAnnouncements ? "SUPPRIMER" : undefined,
      action: {
        label: "Supprimer",
        onClick: () => {
          deleteFieldMutation.mutate();
        },
      },
    });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-destructive hover:bg-destructive/10"
      onClick={handleDeleteClick}
      disabled={deleteFieldMutation.isPending}
    >
      <Trash2 className="mr-2 h-3.5 w-3.5" />
      Supprimer
    </Button>
  );
}
