"use server";

import { auth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher/pusher-server";
import { authAction } from "@/lib/backend/safe-actions";
import { SendMessageSchema } from "./send-message.schema";

export const sendMessageAction = authAction
  .schema(SendMessageSchema)
  .action(async ({ parsedInput: input, ctx }) => {
    const user = await auth();
    if (!user) throw new Error("unauthorized");

    const gleaning = await prisma.gleaning.findUnique({
      where: { id: input.gleaningId },
      include: {
        announcement: { select: { ownerId: true } },
        participations: { select: { userId: true } },
      },
    });

    if (!gleaning) throw new Error("gleaning not found");

    const isOwner = gleaning.announcement.ownerId === user.id;
    const isParticipant = gleaning.participations.some(
      (p) => p.userId === ctx.user.id,
    );
    if (!isOwner && !isParticipant) throw new Error("not allowed");

    const message = await prisma.message.create({
      data: {
        gleaningId: input.gleaningId,
        senderId: ctx.user.id,
        type: input.type,
        content: input.content,
      },
      include: { sender: true },
    });

    await pusherServer.trigger(`gleaning-${input.gleaningId}`, "new-message", {
      id: message.id,
      senderId: message.senderId,
      senderName: message.sender.name,
      type: message.type,
      content: message.content,
      createdAt: message.createdAt,
    });

    return message;
  });
