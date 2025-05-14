"use server";

import { authAction } from "@/lib/backend/safe-actions";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const ToggleNotificationsSchema = z.object({
  notificationsEnabled: z.boolean(),
});

export const toggleNotificationsAction = authAction
  .schema(ToggleNotificationsSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    await prisma.user.update({
      where: {
        id: ctx.user.id,
      },
      data: {
        notificationsEnabled: input.notificationsEnabled,
      },
    });

    return {
      success: true,
    };
  });
