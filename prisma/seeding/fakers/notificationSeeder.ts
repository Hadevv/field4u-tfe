import { Context } from "../types";
import { faker } from "./utils/faker";
import { NotificationType } from "@prisma/client";

export async function fakerNotifications(ctx: Context) {
  console.log("🌱 Seeding notifications...");

  const notifications = [];

  // Notifications pour les glaneurs
  const gleaners = ctx.created.users.filter((user) => user.role === "GLEANER");
  for (const gleaner of gleaners) {
    // 60% de chance d'avoir des notifications
    if (faker.datatype.boolean({ probability: 0.6 })) {
      const numNotifications = faker.number.int({ min: 1, max: 5 });

      for (let i = 0; i < numNotifications; i++) {
        const type = faker.helpers.arrayElement([
          NotificationType.NEW_ANNOUNCEMENT,
          NotificationType.GLEANING_ACCEPTED,
          NotificationType.GLEANING_CANCELLED,
        ]);

        let message;
        switch (type) {
          case NotificationType.NEW_ANNOUNCEMENT:
            message = `Nouvelle opportunité de glanage de ${faker.helpers.arrayElement(ctx.created.cropTypes).name} près de ${faker.location.city()}`;
            break;
          case NotificationType.GLEANING_ACCEPTED:
            message = "Votre demande de participation a été acceptée";
            break;
          case NotificationType.GLEANING_CANCELLED:
            message = "Une session de glanage a été annulée";
            break;
        }

        notifications.push({
          userId: gleaner.id,
          type,
          message,
          isRead: faker.datatype.boolean({ probability: 0.3 }),
        });
      }
    }
  }

  // Notifications pour les agriculteurs
  const farmers = ctx.created.users.filter((user) => user.role === "FARMER");
  for (const farmer of farmers) {
    // 40% de chance d'avoir des notifications
    if (faker.datatype.boolean({ probability: 0.4 })) {
      const numNotifications = faker.number.int({ min: 1, max: 3 });

      for (let i = 0; i < numNotifications; i++) {
        const type = NotificationType.RESERVATION_REQUEST;
        notifications.push({
          userId: farmer.id,
          type,
          message: "Nouvelle demande de participation à votre annonce",
          isRead: faker.datatype.boolean({ probability: 0.5 }),
        });
      }
    }
  }

  const createdNotifications = await Promise.all(
    notifications.map((notification) =>
      ctx.prisma.notification.create({ data: notification }),
    ),
  );

  ctx.created.notifications = createdNotifications;
  return createdNotifications;
}
