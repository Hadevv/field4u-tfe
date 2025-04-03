"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Farm } from "@prisma/client";
import { z } from "zod";
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
import { updateFarmAction } from "./update-farm.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const FarmSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  city: z.string().min(2, "La ville est requise"),
  postalCode: z.string().min(4, "Le code postal est requis"),
  contactInfo: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type FarmFormProps = {
  farm?: Farm;
};

export function FarmForm({ farm }: FarmFormProps) {
  const router = useRouter();
  const isEditing = !!farm;

  const form = useZodForm({
    schema: FarmSchema,
    defaultValues: {
      name: farm?.name || "",
      description: farm?.description || "",
      city: farm?.city || "",
      postalCode: farm?.postalCode || "",
      contactInfo: farm?.contactInfo || "",
      latitude: farm?.latitude || undefined,
      longitude: farm?.longitude || undefined,
    },
  });

  const updateFarmMutation = useMutation({
    mutationFn: async (values: z.infer<typeof FarmSchema>) => {
      return resolveActionResult(
        updateFarmAction({
          id: farm?.id,
          ...values,
        }),
      );
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success(
        isEditing ? "Exploitation mise à jour" : "Exploitation créée",
      );
      if (!isEditing) {
        router.push("/farm/details");
      }
      router.refresh();
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    updateFarmMutation.mutate(data);
  });

  return (
    <Card className="border-green-100">
      <CardHeader>
        <CardTitle>
          {isEditing ? "Modifier l'exploitation" : "Créer une exploitation"}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Modifiez les informations de votre exploitation agricole"
            : "Renseignez les informations de base de votre exploitation"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form form={form} onSubmit={onSubmit}>
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de l'exploitation</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex: Ferme des Oliviers" />
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
                  <FormLabel>Informations de contact</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ex: 04 78 XX XX XX ou email@ferme.fr"
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
                    <Input {...field} placeholder="Ex: Lyon" />
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
                    <Input {...field} placeholder="Ex: 69000" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="sm:col-span-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Décrivez votre exploitation (type de culture, superficie, particularités...)"
                        className="h-32"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/farm")}
                disabled={updateFarmMutation.isPending}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={updateFarmMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
              >
                {updateFarmMutation.isPending
                  ? "Enregistrement..."
                  : isEditing
                    ? "Mettre à jour"
                    : "Créer l'exploitation"}
              </Button>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
