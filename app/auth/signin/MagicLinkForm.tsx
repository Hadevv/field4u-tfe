import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  useZodForm,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/features/form/SubmitButton";
import { getServerUrl } from "@/lib/server-url";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";

const FormSchema = z.object({
  email: z.string().email("veuillez saisir un email valide"),
});

export const MagicLinkForm = () => {
  const form = useZodForm({
    schema: FormSchema,
  });
  const searchParams = useSearchParams();
  const mutation = useMutation({
    mutationFn: async (email: string) => {
      await signIn("resend", {
        callbackUrl: searchParams.get("callbackUrl") ?? `${getServerUrl()}/`,
        redirect: true,
        email,
        verifyCallbackUrl: `/auth/verify-request?email=${encodeURIComponent(email)}`,
      });
    },
  });

  return (
    <>
      <Form
        form={form}
        onSubmit={async (values) => {
          await mutation.mutateAsync(values.email);
        }}
        className="flex w-full items-center gap-2"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl className="w-full">
                <Input
                  className="w-full"
                  placeholder="adresse e-mail"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton loading={mutation.isPending} type="submit" size="sm">
          Connexion
        </LoadingButton>
      </Form>
    </>
  );
};
