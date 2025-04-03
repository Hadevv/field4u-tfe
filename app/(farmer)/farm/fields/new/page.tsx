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
import { LoadingButton } from "@/features/form/SubmitButton";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { createFieldAction } from "./create-field.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Combobox } from "@/components/ui/combobox";
import { MapPin } from "lucide-react";

const CreateFieldSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  city: z.string().min(2, "La ville est requise"),
  postalCode: z.string().min(4, "Le code postal est requis"),
  surface: z
    .number()
    .min(0.01, "La surface doit être supérieure à 0")
    .optional(),
  farmId: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export default function CreateFieldPage() {
  const router = useRouter();

  const form = useZodForm({
    schema: CreateFieldSchema,
    defaultValues: {
      name: "",
      city: "",
      postalCode: "",
      surface: undefined,
      farmId: undefined,
      latitude: 50.6402809, // Exemple de coordonnées pour la Belgique
      longitude: 4.6667145,
    },
  });

  // Requête pour obtenir les exploitations de l'agriculteur
  const farmsQuery = useQuery({
    queryKey: ["farms"],
    queryFn: async () => {
      // Simulation - à remplacer par une véritable requête
      return [
        { id: "farm1", name: "Ma Ferme Principale" },
        { id: "farm2", name: "Exploitation Secondaire" },
      ];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof CreateFieldSchema>) => {
      return resolveActionResult(createFieldAction(data));
    },
    onSuccess: () => {
      toast.success("Champ ajouté avec succès");
      router.push("/farm/fields");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Ajouter un nouveau champ</LayoutTitle>
        <LayoutDescription>
          Enregistrez un nouveau champ pour pouvoir y créer des annonces de
          glanage.
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom du champ</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Champ Nord" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="farmId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exploitation (optionnel)</FormLabel>
                        <FormControl>
                          <Combobox
                            options={
                              farmsQuery.data?.map((f) => ({
                                label: f.name,
                                value: f.id,
                              })) || []
                            }
                            placeholder="Sélectionnez une exploitation"
                            emptyText="Aucune exploitation trouvée"
                            value={field.value || ""}
                            onChange={field.onChange}
                            disabled={farmsQuery.isPending}
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
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ville</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Bruxelles" {...field} />
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
                        <FormLabel>Code postal</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: 1000" {...field} />
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
                      <FormLabel>Surface (hectares) - Optionnel</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Ex: 2.5"
                          step="0.01"
                          min="0.01"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Localisation du champ</FormLabel>
                  <div className="border border-green-100 rounded-md p-4 bg-green-50/50">
                    <div className="flex items-center gap-2 mb-4 text-green-700">
                      <MapPin className="h-5 w-5" />
                      <p className="text-sm">
                        Précisez la position exacte de votre champ sur la carte
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="latitude"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Latitude</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.0000001"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
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
                            <FormLabel>Longitude</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.0000001"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(parseFloat(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="mt-4 h-[300px] bg-gray-100 rounded-md border border-green-100 flex items-center justify-center">
                      {/* Ici, vous pourriez intégrer une carte interactive (Mapbox, GoogleMaps, etc.) */}
                      <p className="text-sm text-muted-foreground">
                        Carte interactive (à implémenter)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <LoadingButton
                    type="submit"
                    size="lg"
                    loading={createMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Ajouter ce champ
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
