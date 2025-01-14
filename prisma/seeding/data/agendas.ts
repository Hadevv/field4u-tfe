import { AgendaStatus } from '@prisma/client';

export const createAgendas = (userIds: string[], announcementIds: string[]) => [
  {
    userId: userIds[1],
    announcementId: announcementIds[0],
    startDate: new Date('2024-09-15T09:00:00'),
    endDate: new Date('2024-09-15T12:00:00'),
    title: "Glanage de pommes de terre à Namur",
    description: "Session de glanage du matin",
    status: AgendaStatus.CONFIRMED,
  },
  {
    userId: userIds[4],
    announcementId: announcementIds[1],
    startDate: new Date('2024-10-10T14:00:00'),
    endDate: new Date('2024-10-10T17:00:00'),
    title: "Glanage de pommes à Gembloux",
    description: "Session de glanage de l'après-midi",
    status: AgendaStatus.PENDING,
  },
];