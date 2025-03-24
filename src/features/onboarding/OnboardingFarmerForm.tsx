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
import {
  FarmFormSchema,
  FarmFormType,
} from "../../../app/auth/onboarding/onboarding.schema";
import { createFarmAction } from "../../../app/auth/onboarding/onboarding.action";

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
    },
  });

  const createFarmMutation = useMutation({
    mutationFn: async (values: FarmFormType) => {
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
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ville</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ville principale"
                  {...field}
                  autoComplete="address-level2"
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
                <Input
                  placeholder="XXXXX"
                  {...field}
                  pattern="\d{5}"
                  autoComplete="postal-code"
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

      <SubmitButton className="w-full">
        Enregistrer mon exploitation
      </SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        Vous pourrez ajouter des parcelles et des disponibilités après cette
        étape
      </p>
    </Form>
  );
};
