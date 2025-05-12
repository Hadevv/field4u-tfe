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
import { Switch } from "@/components/ui/switch";
import { useMutation } from "@tanstack/react-query";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { toast } from "sonner";
import {
  createAnnouncementAction,
  updateAnnouncementAction,
} from "../../../../app/admin/announcements/actions";
import {
  CreateAnnouncementSchema,
  UpdateAnnouncementSchema,
} from "../../../../app/admin/announcements/schema";
import {
  type Announcement,
  type CropType,
  type Field,
  type User,
  type Farm,
} from "@prisma/client";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Combobox } from "@/components/ui/combobox";

type AnnouncementWithRelations = Announcement & {
  field: Field & {
    farm?: Farm | null;
    owner?: User | null;
  };
  cropType: CropType;
  owner: User;
};

type FieldWithRelations = Field & {
  farm?: Farm | null;
  owner?: User | null;
};

type CreateEditAnnouncementDialogProps = {
  announcement?: AnnouncementWithRelations;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAnnouncementSaved: () => void;
  fields: FieldWithRelations[];
  cropTypes: CropType[];
  users: User[];
};

type CreateAnnouncementFormValues = z.infer<typeof CreateAnnouncementSchema>;
type UpdateAnnouncementFormValues = z.infer<typeof UpdateAnnouncementSchema>;
type FormValues = CreateAnnouncementFormValues | UpdateAnnouncementFormValues;

export function CreateEditAnnouncementDialog({
  announcement,
  open,
  onOpenChange,
  onAnnouncementSaved,
  fields,
  cropTypes,
  users,
}: CreateEditAnnouncementDialogProps) {
  const isEditing = !!announcement;

  const form = useZodForm({
    schema: isEditing ? UpdateAnnouncementSchema : CreateAnnouncementSchema,
    defaultValues: isEditing
      ? {
          id: announcement.id,
          title: announcement.title,
          description: announcement.description,
          fieldId: announcement.fieldId,
          cropTypeId: announcement.cropTypeId,
          quantityAvailable: announcement.quantityAvailable || undefined,
          ownerId: announcement.ownerId,
          isPublished: announcement.isPublished,
          startDate: announcement.startDate || undefined,
          endDate: announcement.endDate || undefined,
          images: announcement.images,
        }
      : {
          title: "",
          description: "",
          fieldId: "",
          cropTypeId: "",
          quantityAvailable: undefined,
          ownerId: "",
          isPublished: true,
          startDate: undefined,
          endDate: undefined,
          images: [],
        },
  });

  const createMutation = useMutation({
    mutationFn: async (values: CreateAnnouncementFormValues) => {
      return resolveActionResult(createAnnouncementAction(values));
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("annonce créée avec succès");
      form.reset();
      onOpenChange(false);
      onAnnouncementSaved();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: UpdateAnnouncementFormValues) => {
      return resolveActionResult(updateAnnouncementAction(values));
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("annonce mise à jour avec succès");
      onOpenChange(false);
      onAnnouncementSaved();
    },
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (data: FormValues) => {
    if (isEditing) {
      updateMutation.mutate(data as UpdateAnnouncementFormValues);
    } else {
      createMutation.mutate(data as CreateAnnouncementFormValues);
    }
  };

  const fieldOptions = fields.map((field) => ({
    value: field.id,
    label: `${field.name || "Champ sans nom"} - ${field.city}`,
  }));

  const cropTypeOptions = cropTypes.map((cropType) => ({
    value: cropType.id,
    label: cropType.name,
  }));

  const userOptions = users.map((user) => ({
    value: user.id,
    label: user.name || user.email || "Utilisateur sans nom",
  }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "modifier l'annonce" : "créer une annonce"}
          </DialogTitle>
        </DialogHeader>

        <Form form={form} onSubmit={onSubmit}>
          <div className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>titre</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>description</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fieldId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>champ</FormLabel>
                    <FormControl>
                      <Combobox
                        options={fieldOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="sélectionner un champ"
                        emptyMessage="aucun champ trouvé"
                        searchPlaceholder="rechercher un champ..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cropTypeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>type de culture</FormLabel>
                    <FormControl>
                      <Combobox
                        options={cropTypeOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="sélectionner un type de culture"
                        emptyMessage="aucun type de culture trouvé"
                        searchPlaceholder="rechercher un type de culture..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ownerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>propriétaire</FormLabel>
                    <FormControl>
                      <Combobox
                        options={userOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="sélectionner un propriétaire"
                        emptyMessage="aucun propriétaire trouvé"
                        searchPlaceholder="rechercher un propriétaire..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantityAvailable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>quantité disponible (en kg)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(
                            value ? parseInt(value, 10) : undefined,
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>date de début</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            size="sm"
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "dd/MM/yyyy")
                            ) : (
                              <span>sélectionner une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => field.onChange(date)}
                          disabled={(date) => {
                            const endDate = form.getValues("endDate");
                            return endDate ? date > new Date(endDate) : false;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>date de fin</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            size="sm"
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), "dd/MM/yyyy")
                            ) : (
                              <span>sélectionner une date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => field.onChange(date)}
                          disabled={(date) => {
                            const startDate = form.getValues("startDate");
                            return startDate
                              ? date < new Date(startDate)
                              : false;
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>publier l'annonce</FormLabel>
                    <div className="text-[0.8rem] text-muted-foreground">
                      l'annonce sera visible par tous les utilisateurs
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              annuler
            </Button>
            <Button size="sm" type="submit" disabled={isPending}>
              {isEditing ? "mettre à jour" : "créer"}
            </Button>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
