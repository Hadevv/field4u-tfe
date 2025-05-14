"use client";

import { Field } from "@prisma/client";
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
import { createFieldAction } from "./new/create-field.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FieldSchema, FieldSchemaType } from "./new/create-field.schema";
import { MapPin } from "lucide-react";
import { MapboxField } from "@/components/mapbox/MapboxField";
import { useState } from "react";
import { BelgianPostalSearch } from "@/features/form/BelgianPostalSearch";

type GeolocationResult = {
  city: string;
  latitude: number;
  longitude: number;
  postalCode?: string;
  country?: string;
  street?: string;
  streetNumber?: string;
  formattedAddress?: string;
  source: "geolocation" | "user_prefs" | "none";
  success: boolean;
};

type FieldFormProps = {
  field?: Field;
  farmId?: string;
  onSuccess?: () => void;
  showCancel?: boolean;
};

export function FieldForm({
  field,
  farmId,
  onSuccess,
  showCancel = true,
}: FieldFormProps) {
  const router = useRouter();
  const isEditing = !!field;

  const form = useZodForm({
    schema: FieldSchema,
    defaultValues: {
      name: field?.name || "",
      city: field?.city || "",
      postalCode: field?.postalCode || "",
      surface: field?.surface || undefined,
      farmId: field?.farmId || farmId,
      latitude: field?.latitude || 50.6402809,
      longitude: field?.longitude || 4.6667145,
    },
  });

  const [locationInfo, setLocationInfo] = useState<GeolocationResult | null>(
    null,
  );

  const handleLocationChange = (
    lat: number,
    lng: number,
    info?: GeolocationResult,
  ) => {
    form.setValue("latitude", lat);
    form.setValue("longitude", lng);

    if (info && info.success) {
      form.setValue("city", info.city);
      if (info.postalCode) {
        form.setValue("postalCode", info.postalCode);
      }
      setLocationInfo(info);
    }
  };

  const createFieldMutation = useMutation({
    mutationFn: async (values: FieldSchemaType) => {
      return resolveActionResult(createFieldAction(values));
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success(isEditing ? "Champ mis à jour" : "Champ créé");
      if (onSuccess) {
        onSuccess();
      } else if (!isEditing) {
        router.push("/farm/fields");
      }
      router.refresh();
    },
  });

  const handleSubmit = (data: FieldSchemaType) => {
    createFieldMutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? "Modifier le champ" : "Ajouter un nouveau champ"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Modifiez les informations de votre champ"
            : "Enregistrez un nouveau champ pour pouvoir y créer des annonces de glanage"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form form={form} onSubmit={handleSubmit}>
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

              <div className="hidden">
                <FormField
                  control={form.control}
                  name="farmId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exploitation</FormLabel>
                      <FormControl>
                        <Input type="hidden" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ville</FormLabel>
                    <FormControl>
                      <BelgianPostalSearch
                        searchType="city"
                        value={field.value ?? ""}
                        onCityChange={(city) => {
                          form.setValue("city", city, { shouldValidate: true });
                        }}
                        onPostalCodeChange={(postalCode) => {
                          form.setValue("postalCode", postalCode, {
                            shouldValidate: true,
                          });
                        }}
                      />
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
                      <BelgianPostalSearch
                        searchType="postal"
                        value={field.value ?? ""}
                        onCityChange={(city) => {
                          form.setValue("city", city, { shouldValidate: true });
                        }}
                        onPostalCodeChange={(postalCode) => {
                          form.setValue("postalCode", postalCode, {
                            shouldValidate: true,
                          });
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
                  <FormLabel>Surface (hectares) - Optionnel</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Ex: 2.5"
                      step="0.01"
                      min="0.01"
                      value={field.value || ""}
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
              <label className="text-sm font-medium">
                Localisation du champ
              </label>
              <div className="border rounded-md p-4">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-5 w-5" />
                  <p className="text-sm">
                    Précisez la position exacte de votre champ sur la carte
                  </p>
                </div>

                <MapboxField
                  initialLatitude={form.watch("latitude")}
                  initialLongitude={form.watch("longitude")}
                  onLocationChange={handleLocationChange}
                />

                <div className="grid gap-4 md:grid-cols-2 mt-4">
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
              </div>
            </div>

            <div className="flex justify-end gap-4">
              {showCancel && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => router.push("/farm/fields")}
                  disabled={createFieldMutation.isPending}
                >
                  Annuler
                </Button>
              )}
              <Button
                type="submit"
                className="bg-primary"
                disabled={createFieldMutation.isPending}
                size="sm"
              >
                {createFieldMutation.isPending
                  ? "Enregistrement..."
                  : isEditing
                    ? "Mettre à jour"
                    : "Créer le champ"}
              </Button>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
