"use server";

import { authAction, ActionError } from "@/lib/backend/safe-actions";
import {
  FarmFormSchema,
  GleanerFormSchema,
  RulesSchema,
} from "./onboarding.schema";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/format/id";
import { cookies } from "next/headers";

export const createFarmAction = authAction
  .schema(FarmFormSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    const userId = ctx.user.id;

    if (!userId) {
      throw new ActionError("non autorisé");
    }

    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          bio: input.description,
          role: "FARMER",
          city: input.city,
          postalCode: input.postalCode,
          termsAcceptedAt: input.termsAcceptedAt,
          acceptGeolocation: input.acceptGeolocation,
          onboardingCompleted: true,
        },
      });

      await prisma.farm.create({
        data: {
          name: input.name,
          slug: generateSlug(input.name),
          city: input.city,
          postalCode: input.postalCode,
          description: input.description,
          contactInfo: input.contactInfo,
          owner: {
            connect: { id: user.id },
          },
        },
      });

      // Mettre à jour le cache d'onboarding
      const cookieStore = await cookies();
      cookieStore.set("onboardingCompleted", "true", {
        maxAge: 60 * 60 * 24 * 7, // 7 jours
        path: "/",
      });

      return { message: "inscription terminée" };
    } catch (error) {
      console.error(error);
      throw new ActionError("échec de l'inscription");
    }
  });

export const createGleanerAction = authAction
  .schema(GleanerFormSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    const userId = ctx.user.id;

    if (!userId) {
      throw new ActionError("non autorisé");
    }

    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          bio: input.bio,
          role: "GLEANER",
          city: input.city,
          postalCode: input.postalCode,
          termsAcceptedAt: input.termsAcceptedAt,
          acceptGeolocation: input.acceptGeolocation,
          onboardingCompleted: true,
        },
      });

      // Mettre à jour le cache d'onboarding
      const cookieStore = await cookies();
      cookieStore.set("onboardingCompleted", "true", {
        maxAge: 60 * 60 * 24 * 7, // 7 jours
        path: "/",
      });

      return { message: "inscription terminée" };
    } catch (error) {
      console.error(error);
      throw new ActionError("échec de l'inscription");
    }
  });

export const acceptRulesAction = authAction
  .schema(RulesSchema)
  .action(async ({ ctx }) => {
    const userId = ctx.user.id;

    if (!userId) {
      throw new ActionError("non autorisé");
    }

    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          rulesAcceptedAt: new Date(),
        },
      });

      return { message: "règles acceptées" };
    } catch (error) {
      console.error(error);
      throw new ActionError("échec de l'acceptation des règles");
    }
  });
