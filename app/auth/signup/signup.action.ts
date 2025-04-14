"use server";

import {
  setupResendCustomer,
  setupStripeCustomer,
} from "@/lib/auth/auth-config-setup";
import {
  hashPassword,
  validatePassword,
} from "@/lib/auth/credentials-provider";
import { ActionError, action } from "@/lib/backend/safe-actions";
import { prisma } from "@/lib/prisma";
import { LoginCredentialsFormScheme } from "./signup.schema";

export const signUpAction = action
  .schema(LoginCredentialsFormScheme)
  .action(async ({ parsedInput: { email, password, name } }) => {
    if (!validatePassword(password)) {
      throw new ActionError(
        "mot de passe invalide. il doit contenir au moins 8 caractères, une lettre et un chiffre",
      );
    }

    try {
      const userData = {
        email,
        hashedPassword: await hashPassword(password),
        name,
      };

      const stripeCustomerId = await setupStripeCustomer(userData);
      const resendContactId = await setupResendCustomer(userData);

      const user = await prisma.user.create({
        data: {
          ...userData,
          stripeCustomerId,
          resendContactId,
        },
      });

      return user;
    } catch {
      throw new ActionError("email déjà utilisé");
    }
  });
