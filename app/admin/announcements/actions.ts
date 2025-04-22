"use server";

import { z } from "zod";
import { authAction } from "@/lib/backend/safe-actions";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth/helper";
import { ActionError } from "@/lib/backend/safe-actions";
import { CreateAnnouncementSchema, UpdateAnnouncementSchema } from "./schema";

export const createAnnouncementAction = authAction
  .schema(CreateAnnouncementSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    await isAdmin();

    try {
      // vérifier que le champ existe
      const field = await prisma.field.findUnique({
        where: { id: input.fieldId },
      });

      if (!field) {
        throw new ActionError("champ non trouvé");
      }

      // vérifier que le type de culture existe
      const cropType = await prisma.cropType.findUnique({
        where: { id: input.cropTypeId },
      });

      if (!cropType) {
        throw new ActionError("type de culture non trouvé");
      }

      // vérifier que le propriétaire existe
      const owner = await prisma.user.findUnique({
        where: { id: input.ownerId },
      });

      if (!owner) {
        throw new ActionError("propriétaire non trouvé");
      }

      // générer un slug à partir du titre
      const slug = input.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      // vérifier que le slug est uniqu
      const existingAnnouncement = await prisma.announcement.findUnique({
        where: { slug },
      });

      if (existingAnnouncement) {
        throw new ActionError(
          "ce titre existe déjà, veuillez en choisir un autre",
        );
      }

      const announcement = await prisma.announcement.create({
        data: {
          title: input.title,
          slug,
          description: input.description,
          fieldId: input.fieldId,
          cropTypeId: input.cropTypeId,
          ownerId: input.ownerId,
          isPublished: input.isPublished,
          quantityAvailable: input.quantityAvailable,
          startDate: input.startDate,
          endDate: input.endDate,
          images: input.images || [],
        },
      });

      return announcement;
    } catch (error) {
      if (error instanceof ActionError) {
        throw error;
      }
      throw new ActionError("erreur lors de la création de l'annonce");
    }
  });

export const updateAnnouncementAction = authAction
  .schema(UpdateAnnouncementSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    await isAdmin();

    try {
      const announcementExists = await prisma.announcement.findUnique({
        where: { id: input.id },
      });

      if (!announcementExists) {
        throw new ActionError("annonce non trouvée");
      }

      // verifier que le champ existe
      const field = await prisma.field.findUnique({
        where: { id: input.fieldId },
      });

      if (!field) {
        throw new ActionError("champ non trouvé");
      }

      // verifier que le type de culture existe
      const cropType = await prisma.cropType.findUnique({
        where: { id: input.cropTypeId },
      });

      if (!cropType) {
        throw new ActionError("type de culture non trouvé");
      }

      // verifier que le propriétaire existe
      const owner = await prisma.user.findUnique({
        where: { id: input.ownerId },
      });

      if (!owner) {
        throw new ActionError("propriétaire non trouvé");
      }

      // genérer un slug à partir du titre s'il change
      let slug = announcementExists.slug;
      if (input.title !== announcementExists.title) {
        slug = input.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

        // verifier que le slug est unique
        const existingAnnouncement = await prisma.announcement.findFirst({
          where: {
            slug,
            NOT: { id: input.id },
          },
        });

        if (existingAnnouncement) {
          throw new ActionError(
            "ce titre existe déjà, veuillez en choisir un autre",
          );
        }
      }

      const announcement = await prisma.announcement.update({
        where: { id: input.id },
        data: {
          title: input.title,
          slug,
          description: input.description,
          fieldId: input.fieldId,
          cropTypeId: input.cropTypeId,
          ownerId: input.ownerId,
          isPublished: input.isPublished,
          quantityAvailable: input.quantityAvailable,
          startDate: input.startDate,
          endDate: input.endDate,
          images: input.images || [],
        },
      });

      return announcement;
    } catch (error) {
      if (error instanceof ActionError) {
        throw error;
      }
      throw new ActionError("erreur lors de la mise à jour de l'annonce");
    }
  });

export const deleteAnnouncementAction = authAction
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: input, ctx }) => {
    await isAdmin();

    try {
      const announcementExists = await prisma.announcement.findUnique({
        where: { id: input.id },
        include: {
          gleaning: true,
        },
      });

      if (!announcementExists) {
        throw new ActionError("annonce non trouvée");
      }

      // vérifier si un glanage est associé à cette annonce
      if (announcementExists.gleaning) {
        // supprimer d'abord le glanage et toutes ses relations
        await prisma.gleaning.delete({
          where: { id: announcementExists.gleaning.id },
        });
      }

      // supprimer l'annonce
      await prisma.announcement.delete({
        where: { id: input.id },
      });

      return { success: true };
    } catch (error) {
      if (error instanceof ActionError) {
        throw error;
      }
      throw new ActionError("erreur lors de la suppression de l'annonce");
    }
  });
