"use server";

import { z } from "zod";
import { authAction } from "@/lib/backend/safe-actions";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth/helper";
import { ActionError } from "@/lib/backend/safe-actions";
import { CreateFieldSchema, UpdateFieldSchema } from "./schema";

export const createFieldAction = authAction
  .schema(CreateFieldSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    await isAdmin();

    try {
      if (input.farmId && input.ownerId) {
        throw new ActionError(
          "un champ doit être lié soit à une ferme, soit à un propriétaire, pas les deux",
        );
      }

      if (!input.farmId && !input.ownerId) {
        throw new ActionError(
          "un champ doit être lié soit à une ferme, soit à un propriétaire",
        );
      }

      if (input.farmId) {
        const farm = await prisma.farm.findUnique({
          where: { id: input.farmId },
        });
        if (!farm) {
          throw new ActionError("ferme non trouvée");
        }
      }

      if (input.ownerId) {
        const owner = await prisma.user.findUnique({
          where: { id: input.ownerId },
        });
        if (!owner) {
          throw new ActionError("propriétaire non trouvé");
        }
      }

      const field = await prisma.field.create({
        data: {
          name: input.name,
          city: input.city,
          postalCode: input.postalCode,
          latitude: input.latitude,
          longitude: input.longitude,
          surface: input.surface,
          farmId: input.farmId,
          ownerId: input.ownerId,
        },
      });

      return field;
    } catch (error) {
      if (error instanceof ActionError) {
        throw error;
      }
      throw new ActionError("erreur lors de la création du champ");
    }
  });

export const updateFieldAction = authAction
  .schema(UpdateFieldSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    await isAdmin();

    try {
      const fieldExists = await prisma.field.findUnique({
        where: { id: input.id },
      });

      if (!fieldExists) {
        throw new ActionError("champ non trouvé");
      }
      if (input.farmId && input.ownerId) {
        throw new ActionError(
          "un champ doit être lié soit à une ferme, soit à un propriétaire, pas les deux",
        );
      }

      if (input.farmId) {
        const farm = await prisma.farm.findUnique({
          where: { id: input.farmId },
        });
        if (!farm) {
          throw new ActionError("ferme non trouvée");
        }
      }

      if (input.ownerId) {
        const owner = await prisma.user.findUnique({
          where: { id: input.ownerId },
        });
        if (!owner) {
          throw new ActionError("propriétaire non trouvé");
        }
      }

      const field = await prisma.field.update({
        where: { id: input.id },
        data: {
          name: input.name,
          city: input.city,
          postalCode: input.postalCode,
          latitude: input.latitude,
          longitude: input.longitude,
          surface: input.surface,
          farmId: input.farmId,
          ownerId: input.ownerId,
        },
      });

      return field;
    } catch (error) {
      if (error instanceof ActionError) {
        throw error;
      }
      throw new ActionError("erreur lors de la mise à jour du champ");
    }
  });

export const deleteFieldAction = authAction
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: input, ctx }) => {
    await isAdmin();

    try {
      const fieldExists = await prisma.field.findUnique({
        where: { id: input.id },
      });

      if (!fieldExists) {
        throw new ActionError("champ non trouvé");
      }

      const hasAnnouncements = await prisma.announcement.findFirst({
        where: { fieldId: input.id },
      });

      if (hasAnnouncements) {
        throw new ActionError(
          "impossible de supprimer un champ qui a des annonces",
        );
      }

      await prisma.field.delete({
        where: { id: input.id },
      });

      return { success: true };
    } catch (error) {
      if (error instanceof ActionError) {
        throw error;
      }
      throw new ActionError("erreur lors de la suppression du champ");
    }
  });
