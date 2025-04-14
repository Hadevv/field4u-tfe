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
import { useCallback, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Loader2 } from "lucide-react";

// type trouvé dans le composant BelgianPostalSearch
type PostalData = {
  column_1: string;
  column_2: string;
  recordid: string;
};

export const OnboardingFarmerForm = ({
  onSubmit,
}: {
  onSubmit: () => void;
}) => {
  const form = useZodForm({
    schema: FarmFormSchema,
    defaultValues: {
      name: "",
      city: "",
      postalCode: "",
      description: "",
      contactInfo: "",
      termsAcceptedAt: null,
    },
  });

  const [postalData, setPostalData] = useState<PostalData[]>([]);

  const handleCityChange = useCallback(
    ({ city }: { city: string }) => {
      form.setValue("city", city, { shouldValidate: true });
      const selectedOption = postalData.find(
        (option) => option.column_2 === city,
      );
      if (selectedOption) {
        form.setValue("postalCode", selectedOption.column_1, {
          shouldValidate: true,
        });
      }
    },
    [form, postalData],
  );

  const handlePostalCodeChange = useCallback(
    ({ postalCode }: { postalCode: string }) => {
      form.setValue("postalCode", postalCode, { shouldValidate: true });
      const selectedOption = postalData.find(
        (option) => option.column_1 === postalCode,
      );
      if (selectedOption) {
        form.setValue("city", selectedOption.column_2, {
          shouldValidate: true,
        });
      }
    },
    [form, postalData],
  );

  const createFarmMutation = useMutation({
    mutationFn: async (values: FarmFormType) => {
      if (!values.termsAcceptedAt) {
        toast.error(
          "Vous devez accepter les termes et conditions pour continuer.",
        );
        throw new Error("Terms not accepted");
      }

      const result = await createFarmAction(values);
      onSubmit();

      if (!result || result.serverError) {
        toast.error("Failed to create farm");
        throw new Error("Failed to create farm");
      }
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
              <FormLabel>Nom de l'exploitation</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ma Ferme"
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
              <FormLabel>Contact principal</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email ou téléphone"
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
              <FormLabel>Ville</FormLabel>
              <FormControl>
                <BelgianPostalSearch
                  searchType="city"
                  value={field.value ?? ""}
                  onChange={handleCityChange}
                  options={postalData}
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
                  onChange={handlePostalCodeChange}
                  options={postalData}
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
            <FormLabel>Description (optionnel)</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Décrivez votre exploitation en quelques mots..."
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
          "Enregistrer mon exploitation"
        )}
      </SubmitButton>
    </Form>
  );
};
