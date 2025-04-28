"use client";

import { Announcement, Prisma } from "@prisma/client";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createAnnouncementAction } from "./new/create-announcement.action";
import {
  AnnouncementSchema,
  AnnouncementSchemaType,
} from "./new/announcement.schema";
import { MapPin, PlusCircle } from "lucide-react";
import { useState } from "react";
import { Combobox } from "@/components/ui/combobox";
import { LoadingButton } from "@/features/form/SubmitButton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { FieldForm } from "../fields/FieldForm";
import { Badge } from "@/components/ui/badge";
import { DateRangePicker } from "./DateRangePicker";
import { FilesDropzone } from "@/features/upload/FilesDropzone";

type OptionType = {
  id: string;
  label: string;
  value: string;
};

type FarmType = {
  id: string;
  name: string;
} | null;

type ExtendedAnnouncement = Announcement & {
  gleaningPeriods?: Array<{
    startDate: Date;
    endDate: Date;
  }>;
  suggestedPrice?: Prisma.Decimal;
};

type AnnouncementFormProps = {
  announcement?: ExtendedAnnouncement;
  onSuccess?: () => void;
  defaultFieldId?: string;
  fields: OptionType[];
  cropTypes: OptionType[];
  farm: FarmType;
  initialData?: ExtendedAnnouncement;
  userId: string;
};

export function AnnouncementForm({
  announcement,
  onSuccess,
  defaultFieldId,
  fields,
  cropTypes,
  farm,
  initialData,
  userId,
}: AnnouncementFormProps) {
  const router = useRouter();
  const isEditing = !!announcement;
  const [showFieldDialog, setShowFieldDialog] = useState(false);

  const defaultStartDate = new Date();
  const defaultEndDate = new Date();
  defaultEndDate.setDate(defaultEndDate.getDate() + 7);

  const form = useZodForm({
    schema: AnnouncementSchema,
    defaultValues: {
      title: announcement?.title || "",
      description: announcement?.description || "",
      fieldId: announcement?.fieldId || defaultFieldId || "",
      cropTypeId: initialData?.cropTypeId || "",
      quantityAvailable: announcement?.quantityAvailable || undefined,
      startDate: initialData?.startDate || undefined,
      endDate: initialData?.endDate || undefined,
      suggestedPrice: initialData?.suggestedPrice
        ? Number(initialData.suggestedPrice)
        : undefined,
      images: announcement?.images || [],
    },
  });

  const selectedField = fields.find((f) => f.id === form.watch("fieldId"));

  const createMutation = useMutation({
    mutationFn: async (data: AnnouncementSchemaType) => {
      // recupérer les fichiers à envoyer directement
      const formData = new FormData();

      const fileElements = document.querySelectorAll("#file-upload");
      if (fileElements.length > 0) {
        const fileInput = fileElements[0] as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
          Array.from(fileInput.files).forEach((file) => {
            formData.append("files", file);
          });
        }
      }

      // creer les données à envoyer
      const submitData = {
        ...data,
        imageFiles: formData.has("files") ? formData : undefined,
      };

      return resolveActionResult(createAnnouncementAction(submitData));
    },
    onSuccess: () => {
      toast.success(
        isEditing ? "Annonce mise à jour" : "Annonce créée avec succès",
      );
      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/farm/announcements");
      }
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? "Modifier l'annonce" : "Créer une nouvelle annonce"}
          </CardTitle>
          <CardDescription>
            {isEditing
              ? "Modifiez les informations de votre annonce de glanage"
              : "Publiez une nouvelle opportunité de glanage pour partager vos surplus de récolte"}
          </CardDescription>
          {farm && (
            <Badge className="bg-primary mt-2 mb-2 w-fit">
              <MapPin className="h-3 w-3 mr-1" />
              {farm.name}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <Form form={form} onSubmit={(data) => createMutation.mutate(data)}>
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre de l'annonce</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Tomates à glaner - Fin août"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fieldId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Champ concerné</FormLabel>
                      <div className="space-y-2">
                        {fields.length > 0 ? (
                          <div className="flex space-x-2">
                            <FormControl className="flex-1">
                              <Combobox
                                options={fields}
                                value={field.value}
                                onValueChange={field.onChange}
                                placeholder="Sélectionner un champ"
                                emptyMessage="Aucun champ trouvé"
                                searchPlaceholder="Rechercher un champ..."
                              />
                            </FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              className="flex-shrink-0"
                              onClick={() => setShowFieldDialog(true)}
                            >
                              <PlusCircle className="h-4 w-4 mr-1" />
                              Nouveau
                            </Button>
                          </div>
                        ) : (
                          <Button
                            asChild
                            variant="outline"
                            className="w-full"
                            onClick={() => setShowFieldDialog(true)}
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Créer votre premier champ
                          </Button>
                        )}
                        {selectedField && (
                          <div className="text-sm text-muted-foreground mt-1 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {selectedField.label}
                          </div>
                        )}
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cropTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type de culture</FormLabel>
                      <FormControl>
                        <Combobox
                          options={cropTypes}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Sélectionner un type de culture"
                          emptyMessage="Aucun type de culture trouvé"
                          searchPlaceholder="Rechercher un type de culture..."
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
                      <FormLabel>Quantité disponible (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 50"
                          value={field.value || ""}
                          onChange={(e) => {
                            const value = e.target.valueAsNumber;
                            field.onChange(isNaN(value) ? undefined : value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="suggestedPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>prix libre suggéré (€)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="5.00"
                          step="0.01"
                          min="0"
                          max="500"
                          {...field}
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? undefined
                                : Number(e.target.value);
                            field.onChange(value);
                          }}
                          value={field.value === undefined ? "" : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Décrivez en détail le glanage proposé (type de culture, conditions, équipement nécessaire...)"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <h3 className="text-lg font-medium mb-2">Période de glanage</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Définissez la période durant laquelle le glanage est possible
                </p>
                <div className="p-4 border rounded-md">
                  <DateRangePicker
                    dateRange={{
                      from: form.watch("startDate"),
                      to: form.watch("endDate"),
                    }}
                    onDateRangeChange={(range) => {
                      if (range && range.from && range.to) {
                        form.setValue("startDate", range.from);
                        form.setValue("endDate", range.to);
                      }
                    }}
                    minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                  />
                  {(form.formState.errors.startDate ||
                    form.formState.errors.endDate) && (
                    <div className="bg-destructive text-sm mt-2">
                      {form.formState.errors.startDate?.message ||
                        form.formState.errors.endDate?.message}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Images</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ajoutez des photos de la culture à glaner pour donner une
                  meilleure idée aux glaneurs
                </p>
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FilesDropzone
                          value={field.value}
                          onChange={field.onChange}
                          maxFiles={3}
                          maxSizeMB={2}
                          acceptedFileTypes={[
                            "image/jpeg",
                            "image/png",
                            "image/jpg",
                          ]}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/farm/announcements")}
                  disabled={createMutation.isPending}
                >
                  Annuler
                </Button>
                <LoadingButton type="submit" loading={createMutation.isPending}>
                  {isEditing ? "Mettre à jour" : "Publier l'annonce"}
                </LoadingButton>
              </div>
            </div>
          </Form>
        </CardContent>
      </Card>

      <Dialog open={showFieldDialog} onOpenChange={setShowFieldDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau champ</DialogTitle>
            <DialogDescription>
              Créez un nouveau champ pour votre annonce de glanage
            </DialogDescription>
          </DialogHeader>
          <FieldForm
            showCancel={false}
            onSuccess={() => {
              setShowFieldDialog(false);
              toast.success("Champ créé avec succès");
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
