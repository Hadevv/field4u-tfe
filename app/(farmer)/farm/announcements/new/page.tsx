"use client";

import {
  useZodForm,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/features/form/SubmitButton";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { createAnnouncementAction } from "./create-announcement.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon, FileImage, Loader2 } from "lucide-react";
import { format } from "date-fns"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ImageUploader } from "@/features/uploads/ImageUploader";

const CreateAnnouncementSchema = z.object({
  title: z.string().min(5, "Le titre doit contenir au moins 5 caractères"),
  description: z
    .string()
    .min(20, "La description doit contenir au moins 20 caractères"),
  fieldId: z.string().min(1, "Veuillez sélectionner un champ"),
  cropTypeId: z.string().min(1, "Veuillez sélectionner un type de culture"),
  quantityAvailable: z
    .number()
    .min(1, "La quantité doit être supérieure à 0")
    .optional(),
  gleaningPeriods: z
    .array(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .min(1, "Veuillez ajouter au moins une période de glanage"),
  images: z.array(z.string()).optional(),
});

export default function CreateAnnouncementPage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);

  const form = useZodForm({
    schema: CreateAnnouncementSchema,
    defaultValues: {
      title: "",
      description: "",
      fieldId: "",
      cropTypeId: "",
      quantityAvailable: undefined,
      gleaningPeriods: [
        {
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        },
      ],
      images: [],
    },
  });

  // Requête pour obtenir les champs de l'agriculteur
  const fieldsQuery = useQuery({
    queryKey: ["fields"],
    queryFn: async () => {
      // Simulation - à remplacer par une véritable requête
      return [
        { id: "field1", name: "Champ principal" },
        { id: "field2", name: "Champ nord" },
      ];
    },
  });

  // Requête pour obtenir les types de cultures
  const cropTypesQuery = useQuery({
    queryKey: ["cropTypes"],
    queryFn: async () => {
      // Simulation - à remplacer par une véritable requête
      return [
        { id: "crop1", name: "Tomates" },
        { id: "crop2", name: "Pommes de terre" },
        { id: "crop3", name: "Carottes" },
      ];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof CreateAnnouncementSchema>) => {
      return resolveActionResult(
        createAnnouncementAction({
          ...data,
          images,
        }),
      );
    },
    onSuccess: () => {
      toast.success("Annonce créée avec succès");
      router.push("/farm/announcements");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleAddGleaningPeriod = () => {
    const currentPeriods = form.getValues().gleaningPeriods;
    const lastPeriod = currentPeriods[currentPeriods.length - 1];

    const newEndDate = new Date(lastPeriod.endDate);
    newEndDate.setDate(newEndDate.getDate() + 7);

    const newStartDate = new Date(lastPeriod.endDate);
    newStartDate.setDate(newStartDate.getDate() + 1);

    form.setValue("gleaningPeriods", [
      ...currentPeriods,
      { startDate: newStartDate, endDate: newEndDate },
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

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Créer une nouvelle annonce</LayoutTitle>
        <LayoutDescription>
          Publiez une nouvelle opportunité de glanage pour partager vos surplus
          de récolte.
        </LayoutDescription>
      </LayoutHeader>

      <LayoutContent>
        <Card className="border-green-100">
          <CardContent className="pt-6">
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
                        <FormControl>
                          <Combobox
                            options={
                              fieldsQuery.data?.map((f) => ({
                                label: f.name,
                                value: f.id,
                              })) || []
                            }
                            placeholder="Sélectionnez un champ"
                            emptyText="Aucun champ trouvé"
                            value={field.value}
                            onChange={field.onChange}
                            disabled={fieldsQuery.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="cropTypeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de culture</FormLabel>
                        <FormControl>
                          <Combobox
                            options={
                              cropTypesQuery.data?.map((c) => ({
                                label: c.name,
                                value: c.id,
                              })) || []
                            }
                            placeholder="Sélectionnez une culture"
                            emptyText="Aucune culture trouvée"
                            value={field.value}
                            onChange={field.onChange}
                            disabled={cropTypesQuery.isPending}
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
                        <FormLabel>
                          Quantité disponible (kg) - Optionnel
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Ex: 50"
                            min={1}
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? parseInt(e.target.value)
                                  : undefined,
                              )
                            }
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
                      <FormLabel>Description détaillée</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Décrivez votre annonce en détail (type de culture, état, quantité, conditions particulières...)"
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel>Périodes de glanage</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddGleaningPeriod}
                      className="text-green-700 border-green-200 hover:bg-green-50"
                    >
                      Ajouter une période
                    </Button>
                  </div>

                  {form.getValues().gleaningPeriods.map((_, index) => (
                    <div
                      key={index}
                      className="flex flex-col space-y-4 p-4 border border-green-100 rounded-md bg-green-50/50"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm text-green-800">
                          Période {index + 1}
                        </span>
                        {form.getValues().gleaningPeriods.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveGleaningPeriod(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            Supprimer
                          </Button>
                        )}
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name={`gleaningPeriods.${index}.startDate`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Date de début</FormLabel>
                              <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`gleaningPeriods.${index}.endDate`}
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>Date de fin</FormLabel>
                              <DatePicker
                                value={field.value}
                                onChange={field.onChange}
                                minDate={
                                  form.getValues().gleaningPeriods[index]
                                    .startDate
                                }
                              />
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <FormLabel>Images (optionnel)</FormLabel>
                  <div className="border border-dashed border-green-200 rounded-md p-6 bg-green-50/50">
                    <ImageUploader
                      onChange={(urls) => setImages(urls)}
                      maxFiles={4}
                      accept="image/*"
                    />

                    {images.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                        {images.map((url, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-square overflow-hidden rounded-md border border-green-100"
                          >
                            <img
                              src={url}
                              alt={`Image ${idx + 1}`}
                              className="object-cover w-full h-full"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setImages(images.filter((_, i) => i !== idx))
                              }
                              className="absolute top-1 right-1 bg-white/80 rounded-full p-1 hover:bg-red-100"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <LoadingButton
                    type="submit"
                    size="lg"
                    loading={createMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Publier l'annonce
                  </LoadingButton>
                </div>
              </div>
            </Form>
          </CardContent>
        </Card>
      </LayoutContent>
    </Layout>
  );
}
