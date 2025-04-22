"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { toast } from "sonner";
import { type Field, type User, type Farm } from "@prisma/client";
import { z } from "zod";
import {
  CreateFieldSchema,
  UpdateFieldSchema,
} from "../../../../app/admin/fields/schema";
import {
  createFieldAction,
  updateFieldAction,
} from "../../../../app/admin/fields/actions";
import { Combobox } from "@/components/ui/combobox";

type FieldWithRelations = Field & {
  owner?: User | null;
  farm?: Farm | null;
};

type CreateEditFieldDialogProps = {
  field?: FieldWithRelations;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFieldSaved: () => void;
  users: User[];
  farms: Farm[];
};

type CreateFieldFormValues = z.infer<typeof CreateFieldSchema>;
type UpdateFieldFormValues = z.infer<typeof UpdateFieldSchema>;
type FormValues = CreateFieldFormValues | UpdateFieldFormValues;

export function CreateEditFieldDialog({
  field,
  open,
  onOpenChange,
  onFieldSaved,
  users,
  farms,
}: CreateEditFieldDialogProps) {
  const isEditing = !!field;

  const form = useZodForm({
    schema: isEditing ? UpdateFieldSchema : CreateFieldSchema,
    defaultValues: isEditing
      ? {
          id: field.id,
          name: field.name || "",
          city: field.city,
          postalCode: field.postalCode,
          latitude: field.latitude,
          longitude: field.longitude,
          surface: field.surface || undefined,
          farmId: field.farmId || undefined,
          ownerId: field.ownerId || undefined,
        }
      : {
          name: "",
          city: "",
          postalCode: "",
          latitude: 0,
          longitude: 0,
          surface: undefined,
          farmId: undefined,
          ownerId: undefined,
        },
  });

  const createMutation = useMutation({
    mutationFn: async (values: CreateFieldFormValues) => {
      return resolveActionResult(createFieldAction(values));
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("champ créé avec succès");
      form.reset();
      onOpenChange(false);
      onFieldSaved();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: UpdateFieldFormValues) => {
      return resolveActionResult(updateFieldAction(values));
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("champ mis à jour avec succès");
      onOpenChange(false);
      onFieldSaved();
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: FormValues) => {
    if (isEditing) {
      updateMutation.mutate(data as UpdateFieldFormValues);
    } else {
      createMutation.mutate(data as CreateFieldFormValues);
    }
  };

  // Préparer les options pour les combobox
  const farmOptions = [
    { value: "none", label: "aucune" },
    ...farms.map((farm) => ({
      value: farm.id,
      label: farm.name,
    })),
  ];

  const userOptions = [
    { value: "none", label: "aucun" },
    ...users.map((user) => ({
      value: user.id,
      label: user.name || user.email || "Utilisateur sans nom",
    })),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "modifier le champ" : "créer un champ"}
          </DialogTitle>
        </DialogHeader>

        <Form form={form} onSubmit={onSubmit}>
          <div className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>nom</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ville</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>code postal</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.000001"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.000001"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseFloat(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="surface"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>surface (ha)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? parseFloat(value) : undefined);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="farmId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ferme</FormLabel>
                    <FormControl>
                      <Combobox
                        options={farmOptions}
                        value={field.value || "none"}
                        onValueChange={(value) =>
                          field.onChange(value === "none" ? undefined : value)
                        }
                        placeholder="sélectionner une ferme"
                        emptyMessage="aucune ferme trouvée"
                        searchPlaceholder="rechercher une ferme..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ownerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>propriétaire</FormLabel>
                    <FormControl>
                      <Combobox
                        options={userOptions}
                        value={field.value || "none"}
                        onValueChange={(value) =>
                          field.onChange(value === "none" ? undefined : value)
                        }
                        placeholder="sélectionner un propriétaire"
                        emptyMessage="aucun propriétaire trouvé"
                        searchPlaceholder="rechercher un propriétaire..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isEditing ? "mettre à jour" : "créer"}
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
