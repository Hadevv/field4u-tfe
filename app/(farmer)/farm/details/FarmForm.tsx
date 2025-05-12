"use client";

import { Farm } from "@prisma/client";
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
import { FarmSchema, FarmSchemaType } from "./farm.schema";

type FarmFormProps = {
  farm: Farm;
};

export function FarmForm({ farm }: FarmFormProps) {
  const router = useRouter();

  const form = useZodForm({
    schema: FarmSchema,
    defaultValues: {
      name: farm.name,
      description: farm.description || "",
      city: farm.city || "",
      postalCode: farm.postalCode || "",
      contactInfo: farm.contactInfo || "",
      latitude: farm.latitude || undefined,
      longitude: farm.longitude || undefined,
    },
  });

  const updateFarmMutation = useMutation({
    mutationFn: async (values: FarmSchemaType) => {
      return resolveActionResult(updateFarmAction(values));
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Exploitation mise à jour");
      router.refresh();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Modifier l'exploitation</CardTitle>
        <CardDescription>
          Modifiez les informations de votre exploitation agricole
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form form={form} onSubmit={(data) => updateFarmMutation.mutate(data)}>
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
                size="sm"
                onClick={() => router.push("/farm")}
                disabled={updateFarmMutation.isPending}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={updateFarmMutation.isPending}
                size="sm"
              >
                {updateFarmMutation.isPending
                  ? "Enregistrement..."
                  : "Mettre à jour"}
              </Button>
            </div>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
}
