"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Typography } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { toggleNotificationsAction } from "./mail-account.action";

type ToggleNotificationsCheckboxProps = {
  notificationsEnabled: boolean;
};

export const ToggleNotificationsCheckbox = ({
  notificationsEnabled,
}: ToggleNotificationsCheckboxProps) => {
  const mutation = useMutation({
    mutationFn: async (enabled: boolean) => {
      const result = await toggleNotificationsAction({
        notificationsEnabled: enabled,
      });

      if (!result?.data) {
        toast.error(result?.serverError ?? "une erreur est survenue");
        return;
      }

      toast.success(
        "vous avez mis à jour vos paramètres de notifications dans l'application",
      );
    },
  });

  return (
    <div
      className={cn(
        "flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4",
        {
          "bg-muted": mutation.isPending,
        },
      )}
    >
      <Checkbox
        id="notifications-checkbox"
        defaultChecked={notificationsEnabled}
        disabled={mutation.isPending}
        onCheckedChange={(checked) => {
          const newChecked = Boolean(checked);

          mutation.mutate(newChecked);
        }}
      />
      <div className="space-y-1 leading-none">
        <Label htmlFor="notifications-checkbox">
          Notifications dans l'application
        </Label>
        <Typography variant="muted">
          Activez cette option pour recevoir des notifications dans
          l'application concernant vos champs et récoltes
        </Typography>
      </div>
    </div>
  );
};
