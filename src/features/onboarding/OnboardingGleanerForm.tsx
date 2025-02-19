"use client";

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
import { Checkbox } from "@/components/ui/checkbox";
import { SubmitButton } from "@/features/form/SubmitButton";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  GleanerFormType,
  GleanerFormSchema,
} from "../../../app/auth/onboarding/onboarding.schema";
import { createGleanerAction } from "../../../app/auth/onboarding/onboarding.action";

export function OnboardingGleanerForm() {
  const router = useRouter();
  const form = useZodForm({
    schema: GleanerFormSchema,
    defaultValues: {
      name: "",
      bio: "",
      city: "",
      postalCode: "",
      acceptTerms: false,
    },
  });

  const createGleanerMutation = useMutation({
    mutationFn: async (values: GleanerFormType) => {
      const result = await createGleanerAction(values);
      if (!result || result.serverError) {
        toast.error("Failed to create gleaner");
        throw new Error("Failed to create gleaner");
      }
      router.push("/dashboard");
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom de l'équipe/organisation</FormLabel>
              <FormControl>
                <Input placeholder="Les Glaneurs Solidaires" {...field} />
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
              <FormLabel>Ville principale</FormLabel>
              <FormControl>
                <Input placeholder="Votre ville d'activité" {...field} />
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
                <Input placeholder="XXXXX" {...field} pattern="\d{5}" />
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
        name="acceptTerms"
        render={({ field }) => (
          <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
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
        Finaliser mon profil glaneur
      </SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        Vous pourrez modifier ces informations et ajouter des membres
        ultérieurement
      </p>
    </Form>
  );
}
