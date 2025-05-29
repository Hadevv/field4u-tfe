/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { authAction } from "@/lib/backend/safe-actions";
import { isFarmer } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FieldSchema } from "./create-field.schema";

export const createFieldAction = authAction
  .schema(FieldSchema)
  .action(async ({ parsedInput, ctx }) => {
    // vérifier que l'utilisateur est bien un agriculteur
    try {
      await isFarmer();
    } catch (error) {
      throw new Error("Vous n'avez pas les droits pour créer un champ");
    }

    const user = ctx.user;

    try {
      // si un id de ferme est fourni, vérifier que la ferme appartient à l'utilisateur
      if (parsedInput.farmId) {
        const farm = await prisma.farm.findFirst({
          where: {
            id: parsedInput.farmId,
            ownerId: user.id,
          },
        });

        if (!farm) {
          throw new Error(
            "Cette exploitation n'existe pas ou ne vous appartient pas",
          );
        }
      }

      // créer le champ
      const field = await prisma.field.create({
        data: {
          name: parsedInput.name,
          city: parsedInput.city,
          postalCode: parsedInput.postalCode,
          surface: parsedInput.surface,
          farmId: parsedInput.farmId,
          ownerId: parsedInput.farmId ? null : user.id, // si associé à une ferme, pas de propriétaire direct
          latitude: parsedInput.latitude,
          longitude: parsedInput.longitude,
        },
      });

      // mettre à jour les statistiques de l'agriculteur
      await prisma.statistic.upsert({
        where: { id: user.id },
        update: {
          totalFields: { increment: 1 },
        },
        create: {
          userId: user.id,
          totalFields: 1,
        },
      });

      // rafraîchir la page des champs
      revalidatePath("/farm/fields");

      return { success: true, fieldId: field.id };
    } catch (error: any) {
      console.error("Erreur lors de la création du champ:", error);
      throw new Error(error.message || "Erreur lors de la création du champ");
    }
  });
