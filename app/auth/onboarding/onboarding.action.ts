"use server";

import { authAction, ActionError } from "@/lib/backend/safe-actions";
import {
  FarmFormSchema,
  GleanerFormSchema,
  RulesSchema,
} from "./onboarding.schema";
import { prisma } from "@/lib/prisma";

export const createFarmAction = authAction
  .schema(FarmFormSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    const userId = ctx.user.id;

    if (!userId) {
      throw new ActionError("Unauthorized");
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
          onboardingCompleted: true,
        },
      });

      await prisma.farm.create({
        data: {
          name: input.name,
          city: input.city,
          postalCode: input.postalCode,
          description: input.description,
          contactInfo: input.contactInfo,
          owner: {
            connect: { id: user.id },
          },
        },
      });

      return { message: "Onboarding completed" };
    } catch (error) {
      console.error(error);
      throw new ActionError("Failed to complete onboarding");
    }
  });

export const createGleanerAction = authAction
  .schema(GleanerFormSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    const userId = ctx.user.id;

    if (!userId) {
      throw new ActionError("Unauthorized");
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

      return { message: "Onboarding completed" };
    } catch (error) {
      console.error(error);
      throw new ActionError("Failed to complete onboarding");
    }
  });

export const acceptRulesAction = authAction
  .schema(RulesSchema)
  .action(async ({ ctx }) => {
    const userId = ctx.user.id;

    if (!userId) {
      throw new ActionError("Unauthorized");
    }

    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          rulesAcceptedAt: new Date(),
        },
      });

      return { message: "Rules accepted" };
    } catch (error) {
      console.error(error);
      throw new ActionError("Failed to accept rules");
    }
  });
