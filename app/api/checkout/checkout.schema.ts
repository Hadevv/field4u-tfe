import { z } from "zod";

export const CheckoutSchema = z.object({
  participationId: z.string(),
  amount: z
    .number()
    .min(1, "le montant minimum est de 1€")
    .max(500, "le montant maximum est de 500€"),
});

export type CheckoutSchemaType = z.infer<typeof CheckoutSchema>;
