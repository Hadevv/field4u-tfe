"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { deleteFieldAction } from "./delete-field.action";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { dialogManager } from "@/features/dialog-manager/dialog-manager-store";

type DeleteFieldButtonProps = {
  fieldId: string;
  fieldName: string;
};

export function DeleteFieldButton({
  fieldId,
  fieldName,
}: DeleteFieldButtonProps) {
  const router = useRouter();

  const deleteFieldMutation = useMutation({
    mutationFn: async () => {
      return resolveActionResult(deleteFieldAction({ fieldId }));
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Champ supprimé avec succès");
      router.refresh();
    },
  });

  const handleDelete = () => {
    dialogManager.add({
      title: "Supprimer le champ",
      description: `Êtes-vous sûr de vouloir supprimer "${fieldName}" ? Cette action est irréversible et supprimera également toutes les annonces liées à ce champ.`,
      confirmText: "SUPPRIMER",
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
      onClick={handleDelete}
      disabled={deleteFieldMutation.isPending}
    >
      <Trash2 className="mr-2 h-3.5 w-3.5" />
      Supprimer
    </Button>
  );
}
