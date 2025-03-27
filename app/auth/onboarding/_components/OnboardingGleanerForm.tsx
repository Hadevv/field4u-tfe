/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback, useMemo } from "react";
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

export function OnboardingGleanerForm({ onSubmit }: { onSubmit: () => void }) {
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [geoData, setGeoData] = useState<{
    city: string;
    postalCode: string;
  } | null>(null);

  const form = useZodForm({
    schema: GleanerFormSchema,
    defaultValues: {
      bio: "",
      city: "",
      postalCode: "",
      termsAcceptedAt: null,
      acceptGeolocation: false,
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
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
          });
        },
      );

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.coords.latitude}&lon=${position.coords.longitude}&accept-language=fr`,
      );

      if (!response.ok) throw new Error("Échec de la géolocalisation");

      const data = await response.json();
      const city =
        data.address.city || data.address.town || data.address.village;
      const postalCode = data.address.postcode
        ?.substring(0, 4)
        .padStart(4, "0");

      if (city && postalCode) {
        const normalizedCity = city
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        setGeoData({
          city: normalizedCity,
          postalCode: postalCode,
        });
      }
    } catch (error) {
      logger.error("Geolocation error", error);
      setGeoError(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setIsGeolocating(false);
    }
  }, []);

  useEffect(() => {
    if (acceptGeolocation && !geoData) {
      handleGeolocation();
    } else if (!acceptGeolocation) {
      setGeoData(null);
      form.resetField("city");
      form.resetField("postalCode");
    }
  }, [acceptGeolocation, geoData, handleGeolocation]);

  useEffect(() => {
    if (geoData) {
      form.setValue("city", geoData.city, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.setValue("postalCode", geoData.postalCode, {
        shouldValidate: true,
        shouldDirty: true,
      });
      form.trigger(["city", "postalCode"]);
    }
  }, [geoData]);

  const geoOptions = useMemo(() => {
    return geoData
      ? [
          {
            column_1: geoData.postalCode,
            column_2: geoData.city,
            recordid: `geo-${geoData.postalCode}`,
          },
        ]
      : [];
  }, [geoData]);

  const handleCityChange = useCallback(
    ({ city }: { city: string }) => {
      form.setValue("city", city, { shouldValidate: true });
      const selectedOption = geoOptions.find(
        (option) => option.column_2 === city,
      );
      if (selectedOption) {
        form.setValue("postalCode", selectedOption.column_1, {
          shouldValidate: true,
        });
      }
    },
    [form, geoOptions],
  );

  const handlePostalCodeChange = useCallback(
    ({ postalCode }: { postalCode: string }) => {
      form.setValue("postalCode", postalCode, { shouldValidate: true });
      const selectedOption = geoOptions.find(
        (option) => option.column_1 === postalCode,
      );
      if (selectedOption) {
        form.setValue("city", selectedOption.column_2, {
          shouldValidate: true,
        });
      }
    },
    [form, geoOptions],
  );

  const createGleanerMutation = useMutation({
    mutationFn: async (values: typeof GleanerFormSchema._type) => {
      if (!values.termsAcceptedAt) {
        toast.error(
          "Vous devez accepter les termes et conditions pour continuer.",
        );
        throw new Error("Terms not accepted");
      }

      const result = await createGleanerAction(values);
      onSubmit();

      if (!result || result.serverError) {
        toast.error("Failed to create gleaner");
        throw new Error("Failed to create gleaner");
      }
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
              <FormLabel>Ville principale</FormLabel>
              <FormControl>
                <BelgianPostalSearch
                  searchType="city"
                  value={field.value || ""}
                  onChange={handleCityChange}
                  options={geoOptions}
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
                  value={field.value || ""}
                  onChange={handlePostalCodeChange}
                  options={geoOptions}
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
            <FormLabel>Présentation (optionnel)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Décrivez votre organisation, vos valeurs..."
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
                    Détection en cours...
                  </span>
                ) : (
                  "J'accepte la géolocalisation (optionnel)"
                )}
              </FormLabel>
              {geoError && (
                <p className="text-sm text-destructive">{geoError}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Votre position est utilisée uniquement pour afficher les champs
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
                J'accepte les{" "}
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
