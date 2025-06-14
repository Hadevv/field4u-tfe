"use server";

import { z } from "zod";
import { authAction } from "@/lib/backend/safe-actions";
import { prisma } from "@/lib/prisma";
import { isAdmin } from "@/lib/auth/helper";
import { ActionError } from "@/lib/backend/safe-actions";
import { CreateUserSchema, UpdateUserSchema } from "./schema";

export const createUserAction = authAction
  .schema(CreateUserSchema)
  .action(async ({ parsedInput: input }) => {
    await isAdmin();

    try {
      const userExists = await prisma.user.findUnique({
        where: { email: input.email },
      });

      if (userExists) {
        throw new ActionError("cet email est déjà utilisé");
      }

      const user = await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          role: input.role,
          language: input.language,
          plan: input.plan,
          city: input.city,
          postalCode: input.postalCode,
          bio: input.bio,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof ActionError) {
        throw error;
      }
      throw new ActionError("erreur lors de la création de l'utilisateur");
    }
  });

export const updateUserAction = authAction
  .schema(UpdateUserSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    await isAdmin();

    if (!ctx.user.id) {
      throw new ActionError("utilisateur non authentifié");
    }

    try {
      const userExists = await prisma.user.findUnique({
        where: { id: input.id },
      });

      if (!userExists) {
        throw new ActionError("utilisateur non trouvé");
      }

      const emailExists = await prisma.user.findFirst({
        where: {
          email: input.email,
          NOT: {
            id: input.id,
          },
        },
      });

      if (emailExists) {
        throw new ActionError(
          "cet email est déjà utilisé par un autre utilisateur",
        );
      }

      const user = await prisma.user.update({
        where: { id: input.id },
        data: {
          name: input.name,
          email: input.email,
          role: input.role,
          language: input.language,
          plan: input.plan,
          city: input.city,
          postalCode: input.postalCode,
          bio: input.bio,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof ActionError) {
        throw error;
      }
      throw new ActionError("erreur lors de la mise à jour de l'utilisateur");
    }
  });

export const deleteUserAction = authAction
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: input, ctx }) => {
    await isAdmin();

    if (!ctx.user.id) {
      throw new ActionError("utilisateur non authentifié");
    }

    try {
      const userExists = await prisma.user.findUnique({
        where: { id: input.id },
      });

      if (!userExists) {
        throw new ActionError("utilisateur non trouvé");
      }

      if (input.id === ctx.user.id) {
        throw new ActionError("vous ne pouvez pas vous supprimer vous-même");
      }

      await prisma.user.delete({
        where: { id: input.id },
      });

      return { success: true };
    } catch (error) {
      if (error instanceof ActionError) {
        throw error;
      }
      throw new ActionError("erreur lors de la suppression de l'utilisateur");
    }
  });

export const impersonateUserAction = authAction
  .schema(z.object({ userId: z.string() }))
  .action(async ({ parsedInput: input, ctx }) => {
    await isAdmin();

    if (!ctx.user.id) {
      throw new ActionError("utilisateur non authentifié");
    }

    try {
      const targetUser = await prisma.user.findUnique({
        where: { id: input.userId },
      });

      if (!targetUser) {
        throw new ActionError("utilisateur cible non trouvé");
      }

      if (input.userId === ctx.user.id) {
        throw new ActionError("vous ne pouvez pas vous empersonner vous-même");
      }

      console.log(`Admin ${ctx.user.id} is impersonating user ${input.userId}`);

      return {
        success: true,
        targetUser: {
          id: targetUser.id,
          name: targetUser.name,
          email: targetUser.email,
        },
      };
    } catch (error) {
      if (error instanceof ActionError) {
        throw error;
      }
      throw new ActionError("erreur lors de l'impersonation");
    }
  });
