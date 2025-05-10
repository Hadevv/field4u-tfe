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
import { InlineTooltip } from "@/components/ui/tooltip";
import { SubmitButton } from "@/features/form/SubmitButton";
import type { User } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createVerifyEmailAction } from "../verify-email/verify-email.action";
import { updateProfileAction } from "./edit-profile.action";
import type { ProfileFormType } from "./edit-profile.schema";
import { ProfileFormSchema } from "./edit-profile.schema";
import { Switch } from "@/components/ui/switch";

type EditProfileFormProps = {
  defaultValues: User;
};

export const EditProfileForm = ({ defaultValues }: EditProfileFormProps) => {
  const form = useZodForm({
    schema: ProfileFormSchema,
    defaultValues: {
      email: defaultValues.email,
      name: defaultValues.name,
      notificationsEnabled: defaultValues.notificationsEnabled,
    },
  });
  const router = useRouter();

  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormType) => {
      const result = await updateProfileAction(values);

      if (values.email !== defaultValues.email) {
        await createVerifyEmailAction("");
        toast.success(
          "vous avez mis à jour votre email. nous vous avons envoyé un nouveau lien de vérification.",
        );
        router.push("/");
        return;
      }

      if (!result?.data) {
        toast.error(result?.serverError);
        return;
      }

      toast.success("profil mis à jour");
      router.refresh();
    },
  });

  return (
    <Form
      form={form}
      onSubmit={async (v) => updateProfileMutation.mutateAsync(v)}
      disabled={updateProfileMutation.isPending}
      className="flex flex-col gap-4"
    >
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>nom</FormLabel>
            <FormControl>
              <Input placeholder="" {...field} value={field.value ?? ""} />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-1">
              <span>email</span>
              {defaultValues.emailVerified ? (
                <InlineTooltip title="email vérifié. si vous changez votre email, vous devrez le vérifier à nouveau.">
                  <BadgeCheck size={16} />
                </InlineTooltip>
              ) : null}
            </FormLabel>
            <FormControl>
              <Input placeholder="" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="notificationsEnabled"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center gap-2 py-2">
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                id="notificationsEnabled"
              />
            </FormControl>
            <FormLabel htmlFor="notificationsEnabled" className="text-sm">
              activer les notifications
            </FormLabel>
          </FormItem>
        )}
      />
      <SubmitButton className="w-fit self-end" size="sm">
        enregistrer
      </SubmitButton>
    </Form>
  );
};
