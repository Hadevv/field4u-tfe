"use client";

import { useEffect, useState, useCallback } from "react";
import { useZodForm } from "@/components/ui/form";
import { GleanerFormSchema } from "../onboarding.schema";
import { createGleanerAction } from "../onboarding.action";
import { BelgianPostalSearch } from "@/features/form/BelgianPostalSearch";
import { logger } from "@/lib/logger";
import { toast } from "sonner";
import { SubmitButton } from "@/features/form/SubmitButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useWatch } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { getGeolocation, reverseGeocode } from "@/lib/geo/location-utils";

export function OnboardingGleanerForm({ onSubmit }: { onSubmit: () => void }) {
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isGeolocating, setIsGeolocating] = useState(false);

  const form = useZodForm({
    schema: GleanerFormSchema,
    defaultValues: {
      bio: "",
      city: "",
      postalCode: "",
      acceptGeolocation: false,
      latitude: null,
      longitude: null,
      termsAcceptedAt: null,
    },
  });

  const acceptGeolocation = useWatch({
    control: form.control,
    name: "acceptGeolocation",
  });

  const handleGeolocation = useCallback(async () => {
    setIsGeolocating(true);
    setGeoError(null);

    try {
      const position = await getGeolocation();

      form.setValue("latitude", position.lat, {
        shouldValidate: true,
        shouldDirty: true,
      });

      form.setValue("longitude", position.lng, {
        shouldValidate: true,
        shouldDirty: true,
      });

      const geoResult = await reverseGeocode(position);

      if (geoResult.city && geoResult.postalCode) {
        form.setValue("city", geoResult.city, {
          shouldValidate: true,
          shouldDirty: true,
        });

        form.setValue("postalCode", geoResult.postalCode, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    } catch (error) {
      logger.error("erreur géolocalisation", error);
      setGeoError(
        error instanceof Error ? error.message : "erreur géolocalisation",
      );
    } finally {
      setIsGeolocating(false);
    }
  }, [form]);

  // déclenche la géolocalisation quand l'utilisateur active la checkbox
  useEffect(() => {
    if (acceptGeolocation && !form.getValues("latitude") && !isGeolocating) {
      handleGeolocation();
    }
  }, [acceptGeolocation, form, handleGeolocation, isGeolocating]);

  const createGleanerMutation = useMutation({
    mutationFn: async (values: typeof GleanerFormSchema._type) => {
      if (!values.termsAcceptedAt) {
        toast.error(
          "vous devez accepter les termes et conditions pour continuer.",
        );
        throw new Error("terms not accepted");
      }

      const result = await createGleanerAction(values);

      if (!result || result.serverError) {
        toast.error("échec de création du profil glaneur");
        throw new Error("failed to create gleaner");
      }

      onSubmit();
    },
  });

  return (
    <Form
      form={form}
      onSubmit={async (values) => createGleanerMutation.mutateAsync(values)}
      className="space-y-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ville principale</FormLabel>
              <FormControl>
                <BelgianPostalSearch
                  searchType="city"
                  value={field.value || ""}
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
              <FormLabel>code postal</FormLabel>
              <FormControl>
                <BelgianPostalSearch
                  searchType="postal"
                  value={field.value || ""}
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
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>présentation (optionnel)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="décrivez votre organisation, vos valeurs..."
                {...field}
                className="min-h-[100px]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="acceptGeolocation"
        render={({ field }) => (
          <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={!!field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  setGeoError(null);
                }}
                disabled={isGeolocating}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                {isGeolocating ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    détection en cours...
                  </span>
                ) : (
                  "j'accepte la géolocalisation (optionnel)"
                )}
              </FormLabel>
              {geoError && (
                <p className="text-sm text-destructive">{geoError}</p>
              )}
              <p className="text-sm text-muted-foreground">
                votre position est utilisée uniquement pour afficher les champs
                à proximité
              </p>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="termsAcceptedAt"
        render={({ field }) => (
          <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={!!field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  form.setValue("termsAcceptedAt", checked ? new Date() : null);
                }}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                j'accepte les{" "}
                <Link
                  href="/terms"
                  className="text-primary underline"
                  target="_blank"
                >
                  conditions d'utilisation
                </Link>{" "}
                et la{" "}
                <Link
                  href="/privacy"
                  className="text-primary underline"
                  target="_blank"
                >
                  politique de confidentialité
                </Link>
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      <SubmitButton className="w-full">
        {form.formState.isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          "continuer"
        )}
      </SubmitButton>
    </Form>
  );
}
