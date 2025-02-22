import { Context } from "../types";
import { createNotifications } from "./data/notifications";

export async function seedNotifications(ctx: Context) {
  console.log("🌱 Seeding notifications...");

  const userIds = ctx.created.users.map((user) => user.id);
  const notifications = createNotifications(userIds);

  const createdNotifications = await Promise.all(
    notifications.map((notification) =>
      ctx.prisma.notification.create({ data: notification }),
    ),
  );

  ctx.created.notifications = createdNotifications;
  return createdNotifications;
}
