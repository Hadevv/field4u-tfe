import { prisma } from "@/lib/prisma";
import { pusherServer } from "@/lib/pusher/pusher-server";
import { NotificationType } from "@prisma/client";

export async function sendNotificationToUser(
  userId: string,
  type: NotificationType,
  message: string,
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { notificationsEnabled: true },
  });
  if (!user || user.notificationsEnabled === false) return;

  const notif = await prisma.notification.create({
    data: { userId, type, message },
  });

  await pusherServer.trigger(`private-user-${userId}`, "notification:new", {
    id: notif.id,
    type: notif.type,
    message: notif.message,
    isRead: notif.isRead,
    createdAt: notif.createdAt,
  });
}
