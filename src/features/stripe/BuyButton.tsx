"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ButtonProps } from "../../components/ui/button";
import { Button } from "../../components/ui/button";
import { buyButtonAction } from "./buy-button.action";
import { resolveActionResult } from "@/lib/backend/actions-utils";

export type BuyButtonProps = {
  priceId: string;
} & ButtonProps;

/**
 * This is a button that will create a Stripe checkout session and redirect the user to the checkout page
 * To test the integration, you can use the component like this :
 *
 * ```tsx
 * <BuyButton priceId={env.NODE_ENV === "production" ? "real-price-id" : "dev-price-id"}>Buy now !</BuyButton>
 * ```
 *
 * @param props Button props and Stripe Price Id
 * @param props.priceId This is the Stripe price ID to use for the checkout session
 * @returns
 */
export const BuyButton = ({ priceId, ...props }: BuyButtonProps) => {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async () => {
      return resolveActionResult(
        buyButtonAction({
          priceId: priceId,
        }),
      );
    },
    onSuccess: (data) => {
      if (data?.url) {
        router.push(data.url);
      } else {
        toast.error("erreur lors de la redirection vers la page de paiement");
      }
    },
    onError: (error: Error) => {
      toast.error("erreur lors de la création de la session de paiement", {
        description: error.message || "veuillez réessayer plus tard",
      });
    },
  });

  return (
    <Button
      onClick={() => mutation.mutate()}
      {...props}
      disabled={mutation.isPending || props.disabled}
    />
  );
};
