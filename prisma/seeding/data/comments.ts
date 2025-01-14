export const createComments = (userIds: string[], announcementIds: string[]) => [
  {
    userId: userIds[1],
    announcementId: announcementIds[0],
    content: "Est-ce qu'il y a un parking à proximité du champ ?",
  },
  {
    userId: userIds[4],
    announcementId: announcementIds[0],
    content: "Quelle variété de pommes de terre est disponible ?",
  },
  {
    userId: userIds[1],
    announcementId: announcementIds[1],
    content: "Faut-il apporter son propre matériel ?",
  },
  {
    userId: userIds[4],
    announcementId: announcementIds[1],
    content: "Possible de venir en fin de journée ?",
  },
];