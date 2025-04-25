import Stripe from "stripe";
import { env } from "./env";

// utiliser une approche lazy initialization pour éviter l'erreur avec la clé
let stripeInstance: Stripe | null = null;

export const getStripe = () => {
  if (!stripeInstance) {
    if (!env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is missing");
    }
    stripeInstance = new Stripe(env.STRIPE_SECRET_KEY, {
      typescript: true,
    });
  }
  return stripeInstance;
};

// maintenir une compatibilité avec le code existant
export const stripe = new Proxy({} as Stripe, {
  get: (target, prop) => {
    return getStripe()[prop as keyof Stripe];
  },
});
