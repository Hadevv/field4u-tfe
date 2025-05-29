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
import { SubmitButton } from "@/features/form/SubmitButton";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { FarmFormSchema, FarmFormType } from "../onboarding.schema";
import { createFarmAction } from "../onboarding.action";
import { BelgianPostalSearch } from "@/features/form/BelgianPostalSearch";
import { useCallback, useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useWatch } from "react-hook-form";
import { logger } from "@/lib/logger";
import { getGeolocation, reverseGeocode } from "@/lib/geo/location-utils";

export const OnboardingFarmerForm = ({
  onSubmit,
}: {
  onSubmit: () => void;
}) => {
  const [geoError, setGeoError] = useState<string | null>(null);
  const [isGeolocating, setIsGeolocating] = useState(false);

  const form = useZodForm({
    schema: FarmFormSchema,
    defaultValues: {
      name: "",
      city: "",
      postalCode: "",
      description: "",
      contactInfo: "",
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

  const onGeoDetect = useCallback(async () => {
    try {
      setIsGeolocating(true);
      const position = await getGeolocation();
      if (position) {
        const { lat, lng } = position;
        form.setValue("latitude", lat, { shouldValidate: true });
        form.setValue("longitude", lng, { shouldValidate: true });

        // tente d'obtenir l'adresse via géocodage inversé
        const reverseGeoResult = await reverseGeocode({ lat, lng });
        if (reverseGeoResult) {
          logger.debug("résultat du géocodage inversé", reverseGeoResult);

          if (reverseGeoResult.postalCode) {
            form.setValue("postalCode", reverseGeoResult.postalCode, {
              shouldValidate: true,
            });
          }

          if (reverseGeoResult.city) {
            form.setValue("city", reverseGeoResult.city, {
              shouldValidate: true,
            });
          }
        }
      }
    } catch (error) {
      logger.error("erreur lors de la géolocalisation", error);
      setGeoError(
        "impossible d'obtenir votre position. vérifiez vos permissions de localisation.",
      );
    } finally {
      setIsGeolocating(false);
    }
  }, [form]);

  // surveiller les changements de géolocalisation
  useEffect(() => {
    if (acceptGeolocation && !form.getValues("latitude") && !isGeolocating) {
      onGeoDetect();
    }
  }, [acceptGeolocation, form, isGeolocating, onGeoDetect]);

  const createFarmMutation = useMutation({
    mutationFn: async (values: FarmFormType) => {
      if (!values.termsAcceptedAt) {
        toast.error(
          "vous devez accepter les termes et conditions pour continuer.",
        );
        throw new Error("terms not accepted");
      }

      const result = await createFarmAction(values);

      if (!result || result.serverError) {
        toast.error("échec de création de l'exploitation");
        throw new Error("failed to create farm");
      }

      onSubmit();
    },
  });

  return (
    <Form
      form={form}
      onSubmit={async (values) => createFarmMutation.mutateAsync(values)}
      className="space-y-6"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>nom de l'exploitation</FormLabel>
              <FormControl>
                <Input
                  placeholder="ma ferme"
                  {...field}
                  autoComplete="organization"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>contact principal</FormLabel>
              <FormControl>
                <Input
                  placeholder="email ou téléphone"
                  {...field}
                  autoComplete="tel email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ville</FormLabel>
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
              <FormLabel>code postal</FormLabel>
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
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>description (optionnel)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="décrivez votre exploitation en quelques mots..."
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
          "enregistrer mon exploitation"
        )}
      </SubmitButton>
    </Form>
  );
};
