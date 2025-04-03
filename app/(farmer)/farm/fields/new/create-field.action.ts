"use server";

import { z } from "zod";
import { authAction } from "@/lib/backend/safe-actions";
import { isFarmer } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const CreateFieldSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  city: z.string().min(2, "La ville est requise"),
  postalCode: z.string().min(4, "Le code postal est requis"),
  surface: z
    .number()
    .min(0.01, "La surface doit être supérieure à 0")
    .optional(),
  farmId: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const createFieldAction = authAction
  .schema(CreateFieldSchema)
  .action(async ({ parsedInput, ctx }) => {
    // Vérifier que l'utilisateur est bien un agriculteur
    try {
      await isFarmer();
    } catch (error) {
      throw new Error("Vous n'avez pas les droits pour créer un champ");
    }

    const user = ctx.session.user;

    try {
      // Si un ID de ferme est fourni, vérifier que la ferme appartient à l'utilisateur
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

      // Créer le champ
      const field = await prisma.field.create({
        data: {
          name: parsedInput.name,
          city: parsedInput.city,
          postalCode: parsedInput.postalCode,
          surface: parsedInput.surface,
          farmId: parsedInput.farmId,
          ownerId: parsedInput.farmId ? null : user.id, // Si associé à une ferme, pas de propriétaire direct
          latitude: parsedInput.latitude,
          longitude: parsedInput.longitude,
        },
      });

      // Mettre à jour les statistiques de l'agriculteur
      await prisma.statistic.upsert({
        where: { userId: user.id },
        update: {
          totalFields: { increment: 1 },
        },
        create: {
          userId: user.id,
          totalFields: 1,
        },
      });

      // Rafraîchir la page des champs
      revalidatePath("/farm/fields");

      return { success: true, fieldId: field.id };
    } catch (error: any) {
      console.error("Erreur lors de la création du champ:", error);
      throw new Error(error.message || "Erreur lors de la création du champ");
    }
  });
