"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authAction } from "@/lib/backend/safe-actions";
import { UserRole } from "@prisma/client";

const UpdateFarmSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  city: z.string().min(2, "La ville est requise"),
  postalCode: z.string().min(4, "Le code postal est requis"),
  contactInfo: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const updateFarmAction = authAction
  .schema(UpdateFarmSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    const user = ctx.user;

    // Vérification du rôle
    if (user.role !== UserRole.FARMER) {
      throw new Error(
        "Vous devez être agriculteur pour effectuer cette action",
      );
    }

    // Création ou mise à jour de l'exploitation
    if (input.id) {
      // Vérifier que l'exploitation appartient bien à l'utilisateur
      const existingFarm = await prisma.farm.findUnique({
        where: { id: input.id },
      });

      if (!existingFarm) {
        throw new Error("Exploitation non trouvée");
      }

      if (existingFarm.ownerId !== user.id) {
        throw new Error(
          "Vous n'êtes pas autorisé à modifier cette exploitation",
        );
      }

      // Mise à jour
      const updatedFarm = await prisma.farm.update({
        where: { id: input.id },
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
    } else {
      // Création
      const newFarm = await prisma.farm.create({
        data: {
          name: input.name,
          description: input.description,
          city: input.city,
          postalCode: input.postalCode,
          contactInfo: input.contactInfo,
          latitude: input.latitude,
          longitude: input.longitude,
          ownerId: user.id,
        },
      });

      return { farm: newFarm };
    }
  });
