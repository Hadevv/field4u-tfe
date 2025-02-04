import { NotificationType } from '@prisma/client';

export const createNotifications = (userIds: string[]) => [
  {
    userId: userIds[1],
    type: NotificationType.NEW_ANNOUNCEMENT,
    message: "Nouvelle opportunité de glanage près de chez vous",
    isRead: false,
  },
  {
    userId: userIds[0],
    type: NotificationType.RESERVATION_REQUEST,
    message: "Nouvelle demande de participation à votre annonce",
    isRead: true,
  },
  {
    userId: userIds[4],
    type: NotificationType.GLEANING_ACCEPTED,
    message: "Votre demande de glanage a été acceptée",
    isRead: false,
  },
];