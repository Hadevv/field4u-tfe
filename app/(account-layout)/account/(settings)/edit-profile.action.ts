"use server";

import {
  hashPassword,
  comparePassword,
  validatePassword,
} from "@/lib/auth/credentials-provider";
import { requiredAuth } from "@/lib/auth/helper";
import { ActionError, authAction } from "@/lib/backend/safe-actions";
import { prisma } from "@/lib/prisma";
import {
  EditPasswordFormSchema,
  ProfileFormSchema,
} from "./edit-profile.schema";

export const updateProfileAction = authAction
  .schema(ProfileFormSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    const previousEmail = ctx.user.email;

    const user = await prisma.user.update({
      where: {
        id: ctx.user.id,
      },
      data: {
        name: input.name,
        email: input.email,
        emailVerified: previousEmail === input.email ? undefined : null,
      },
    });

    return user;
  });

export const editPasswordAction = authAction
  .schema(EditPasswordFormSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    const user = await requiredAuth();
    const { hashedPassword } = await prisma.user.findUniqueOrThrow({
      where: {
        id: user.id,
      },
      select: {
        hashedPassword: true,
      },
    });

    if (input.newPassword !== input.confirmPassword) {
      throw new ActionError("Passwords do not match");
    }

    if (!hashedPassword) {
      throw new ActionError("Password hash not found");
    }
    const passwordMatch = await comparePassword(
      input.currentPassword,
      hashedPassword,
    );
    if (!passwordMatch) {
      throw new ActionError("Invalid current password");
    }

    if (!validatePassword(input.newPassword)) {
      throw new ActionError(
        "Invalid new password. Must be at least 8 characters, and contain at least one letter and one number",
      );
    }

    const newHashedPassword = await hashPassword(input.newPassword);

    const updatedUser = await prisma.user.update({
      where: {
        id: ctx.user.id,
      },
      data: {
        hashedPassword: newHashedPassword,
      },
      select: {
        id: true,
      },
    });

    return updatedUser;
  });
