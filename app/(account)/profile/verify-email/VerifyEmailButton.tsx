"use client";

import { LoadingButton } from "@/features/form/SubmitButton";
import { useMutation } from "@tanstack/react-query";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { createVerifyEmailAction } from "./verify-email.action";

export const VerifyEmailButton = () => {
  const mutation = useMutation({
    mutationFn: async () => {
      const result = await createVerifyEmailAction("");

      if (result?.serverError) {
        toast.error(result.serverError ?? "Une erreur est survenue");
        return;
      }

      toast.success("Email envoyé");
    },
  });

  return (
    <LoadingButton
      loading={mutation.isPending}
      variant="outline"
      className="mt-2"
      onClick={() => mutation.mutate()}
    >
      {mutation.isError ? <X size={16} className="mr-2" /> : null}
      {mutation.isSuccess ? <Check size={16} className="mr-2" /> : null}
      Vérifier mon email
    </LoadingButton>
  );
};
