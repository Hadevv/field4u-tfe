/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Announcement } from "@prisma/client";
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
import { MapPin, PlusCircle, Trash2 } from "lucide-react";
import { isValid, parse } from "date-fns";
import { fr } from "date-fns/locale";
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
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "./DateRangePicker";

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
};

type AnnouncementFormProps = {
  announcement?: ExtendedAnnouncement;
  onSuccess?: () => void;
  defaultFieldId?: string;
  fields: OptionType[];
  cropTypes: OptionType[];
  farm: FarmType;
};

export function AnnouncementForm({
  announcement,
  onSuccess,
  defaultFieldId,
  fields,
  cropTypes,
  farm,
}: AnnouncementFormProps) {
  const router = useRouter();
  const isEditing = !!announcement;
  const [images, setImages] = useState<string[]>([]);
  const [showFieldDialog, setShowFieldDialog] = useState(false);

  const form = useZodForm({
    schema: AnnouncementSchema,
    defaultValues: {
      title: announcement?.title || "",
      description: announcement?.description || "",
      fieldId: announcement?.fieldId || defaultFieldId || "",
      cropTypeId: announcement?.cropTypeId || "",
      quantityAvailable: announcement?.quantityAvailable || undefined,
      gleaningPeriods: announcement?.gleaningPeriods
        ? announcement.gleaningPeriods.map((period: any) => ({
            from: new Date(period.startDate),
            to: new Date(period.endDate),
          }))
        : [
            {
              from: new Date(),
              to: new Date(new Date().setDate(new Date().getDate() + 7)),
            },
          ],
      images: announcement?.images || [],
    },
  });

  const selectedField = fields.find((f) => f.id === form.watch("fieldId"));

  const createMutation = useMutation({
    mutationFn: async (data: AnnouncementSchemaType) => {
      return resolveActionResult(
        createAnnouncementAction({
          ...data,
          images,
        }),
      );
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

  const handleAddGleaningPeriod = () => {
    const currentPeriods = form.getValues().gleaningPeriods;
    const lastPeriod = currentPeriods[currentPeriods.length - 1];

    const newFrom = new Date(lastPeriod.to);
    newFrom.setDate(newFrom.getDate() + 1);

    const newTo = new Date(newFrom);
    newTo.setDate(newTo.getDate() + 7);

    form.setValue("gleaningPeriods", [
      ...currentPeriods,
      { from: newFrom, to: newTo },
    ]);
  };

  const handleRemoveGleaningPeriod = (index: number) => {
    const currentPeriods = form.getValues().gleaningPeriods;
    if (currentPeriods.length > 1) {
      form.setValue(
        "gleaningPeriods",
        currentPeriods.filter((_, i) => i !== index),
      );
    }
  };

  // Fonction pour parser une date à partir d'un string
  const parseDateString = (dateString: string, originalDate: Date) => {
    if (!dateString) return null;

    // Essayer avec plusieurs formats
    const formats = ["dd/MM/yyyy", "d/M/yyyy", "dd-MM-yyyy", "d-M-yyyy"];

    for (const formatString of formats) {
      const date = parse(dateString, formatString, new Date(), { locale: fr });
      if (isValid(date)) return date;
    }

    return null;
  };

  return (
    <>
      <Card className="border-green-100">
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
            <Badge
              variant="outline"
              className="mt-2 bg-green-50 text-green-800 inline-flex gap-1 items-center self-start"
            >
              <MapPin className="h-3 w-3" />
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
                            type="button"
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
                <h3 className="text-lg font-medium mb-2">
                  Périodes de glanage
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Définissez les périodes durant lesquelles le glanage est
                  possible pour cette annonce
                </p>
                <div className="space-y-4">
                  {form.watch("gleaningPeriods").map((period, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-4 p-4 border rounded-md bg-background/50"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium">
                          Période {index + 1}
                        </h4>
                        {form.watch("gleaningPeriods").length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveGleaningPeriod(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Supprimer
                          </Button>
                        )}
                      </div>

                      <DateRangePicker
                        dateRange={period as DateRange}
                        onDateRangeChange={(range) => {
                          if (range && range.from && range.to) {
                            const periods = [
                              ...form.getValues().gleaningPeriods,
                            ];
                            periods[index] = range as { from: Date; to: Date };
                            form.setValue("gleaningPeriods", periods);
                          }
                        }}
                        minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                      />

                      {form.formState.errors.gleaningPeriods?.[index] && (
                        <div className="text-red-500 text-sm">
                          {form.formState.errors.gleaningPeriods[index]?.from
                            ?.message ||
                            form.formState.errors.gleaningPeriods[index]?.to
                              ?.message ||
                            (
                              form.formState.errors.gleaningPeriods[
                                index
                              ] as any
                            )?.message}
                        </div>
                      )}
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddGleaningPeriod}
                    className="mt-2"
                  >
                    <PlusCircle className="h-4 w-4 mr-1" />
                    Ajouter une période
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Images</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ajoutez des photos de la culture à glaner pour donner une
                  meilleure idée aux glaneurs
                </p>
                {/* TODO: ajouter un upload d'images */}
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
                <LoadingButton
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                  loading={createMutation.isPending}
                >
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
              // rafraîchir la page pour récupérer les nouvelles données du serveur
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
