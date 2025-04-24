"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { dialogManager } from "@/features/dialog-manager/dialog-manager-store";
import { toast } from "sonner";
import { deleteAccountAction } from "./delete-account.action";

export default function DeleteProfilePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supprimer votre compte</CardTitle>
        <CardDescription>
          La suppression de votre compte signifie que toutes vos données
          personnelles seront définitivement effacées et votre abonnement en
          cours sera résilié. Veuillez noter que cette action est irréversible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant="destructive"
          onClick={() => {
            dialogManager.add({
              title: "Supprimer votre compte",
              description: "Êtes-vous sûr de vouloir supprimer votre compte?",
              action: {
                label: "Supprimer",
                onClick: async () => {
                  await deleteAccountAction();
                  toast.success("Votre compte a été supprimé.");
                },
              },
            });
          }}
        >
          Delete
        </Button>
      </CardContent>
    </Card>
  );
}
