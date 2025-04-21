"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { resolveActionResult } from "@/lib/backend/actions-utils";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { setName } from "../name.action";
import { toast } from "sonner";
import { z } from "zod";

// Définir un schéma côté client pour la validation
const nameSchema = z.object({
  name: z
    .string()
    .min(3, "le nom doit contenir au moins 3 caractères")
    .max(30, "le nom ne peut pas dépasser 30 caractères")
    .regex(
      /^[a-z0-9_-]+$/i,
      "le nom ne peut contenir que des lettres, chiffres, tirets et underscores",
    ),
});

interface NameFormProps {
  email: string;
  redirectUrl?: string;
}

export function NameForm({
  email,
  redirectUrl = "/auth/onboarding",
}: NameFormProps) {
  const router = useRouter();

  // extraire le nom à partir de l'email (partie avant @)
  const suggestedName = email.split("@")[0];

  const form = useZodForm({
    schema: nameSchema,
    defaultValues: {
      name: suggestedName,
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      return resolveActionResult(setName(data));
    },
    onSuccess: () => {
      toast.success("nom défini avec succès");
      router.push(redirectUrl);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (values: { name: string }) => {
    await mutation.mutateAsync(values);
  };

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>votre nom public</FormLabel>
            <FormControl>
              <Input {...field} autoFocus />
            </FormControl>
            <FormDescription>
              ce nom sera affiché publiquement dans l'application
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        type="submit"
        className="mt-4 w-full"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "enregistrement..." : "continuer"}
      </Button>
    </Form>
  );
}
