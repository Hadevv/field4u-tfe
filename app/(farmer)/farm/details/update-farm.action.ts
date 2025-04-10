"use server";

import { prisma } from "@/lib/prisma";
import { authAction } from "@/lib/backend/safe-actions";
import { UserRole } from "@prisma/client";
import { FarmSchema } from "./farm.schema";

export const updateFarmAction = authAction
  .schema(FarmSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    const user = ctx.user;

    if (user.role !== UserRole.FARMER) {
      throw new Error(
        "Vous devez être agriculteur pour effectuer cette action",
      );
    }

    const farm = await prisma.farm.findFirst({
      where: { ownerId: user.id },
    });

    if (!farm) {
      throw new Error(
        "Vous devez créer une exploitation dans l'onboarding avant de pouvoir la modifier",
      );
    }

    const updatedFarm = await prisma.farm.update({
      where: { id: farm.id },
      data: {
        name: input.name,
        description: input.description,
        city: input.city,
        postalCode: input.postalCode,
        contactInfo: input.contactInfo,
        latitude: input.latitude,
        longitude: input.longitude,
      },
    });

    return { farm: updatedFarm };
  });
