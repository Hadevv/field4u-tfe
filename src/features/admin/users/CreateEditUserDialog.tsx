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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { toast } from "sonner";
import {
  createUserAction,
  updateUserAction,
} from "../../../../app/admin/users/actions";
import {
  CreateUserSchema,
  UpdateUserSchema,
} from "../../../../app/admin/users/schema";
import { UserRole, UserPlan, Language, type User } from "@prisma/client";
import { z } from "zod";

type CreateEditUserDialogProps = {
  user?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserSaved: () => void;
};

type CreateUserFormValues = z.infer<typeof CreateUserSchema>;
type UpdateUserFormValues = z.infer<typeof UpdateUserSchema>;
type FormValues = CreateUserFormValues | UpdateUserFormValues;

export function CreateEditUserDialog({
  user,
  open,
  onOpenChange,
  onUserSaved,
}: CreateEditUserDialogProps) {
  const isEditing = !!user;

  const form = useZodForm({
    schema: isEditing ? UpdateUserSchema : CreateUserSchema,
    defaultValues: isEditing
      ? {
          id: user.id,
          name: user.name || "",
          email: user.email,
          role: user.role,
          language: user.language,
          plan: user.plan,
          city: user.city || "",
          postalCode: user.postalCode || "",
          bio: user.bio || "",
        }
      : {
          name: "",
          email: "",
          role: UserRole.GLEANER,
          language: Language.FRENCH,
          plan: UserPlan.FREE,
          city: "",
          postalCode: "",
          bio: "",
        },
  });

  const createMutation = useMutation({
    mutationFn: async (values: CreateUserFormValues) => {
      return resolveActionResult(createUserAction(values));
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("utilisateur créé avec succès");
      form.reset();
      onOpenChange(false);
      onUserSaved();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: UpdateUserFormValues) => {
      return resolveActionResult(updateUserAction(values));
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("utilisateur mis à jour avec succès");
      onOpenChange(false);
      onUserSaved();
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: FormValues) => {
    if (isEditing) {
      updateMutation.mutate(data as UpdateUserFormValues);
    } else {
      createMutation.mutate(data as CreateUserFormValues);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "modifier l'utilisateur" : "créer un utilisateur"}
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

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>rôle</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="sélectionner un rôle" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserRole.ADMIN}>
                          administrateur
                        </SelectItem>
                        <SelectItem value={UserRole.FARMER}>
                          agriculteur
                        </SelectItem>
                        <SelectItem value={UserRole.GLEANER}>
                          glaneur
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="plan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>abonnement</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="sélectionner un abonnement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserPlan.FREE}>gratuit</SelectItem>
                        <SelectItem value={UserPlan.PREMIUM}>
                          premium
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>langue</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="sélectionner une langue" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Language.FRENCH}>français</SelectItem>
                      <SelectItem value={Language.ENGLISH}>anglais</SelectItem>
                      <SelectItem value={Language.DUTCH}>
                        néerlandais
                      </SelectItem>
                    </SelectContent>
                  </Select>
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

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>biographie</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
