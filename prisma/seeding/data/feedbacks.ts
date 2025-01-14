export const createFeedbacks = (userIds: string[]) => [
  {
    userId: userIds[1],
    message: "L'application est très utile pour trouver des opportunités de glanage",
    email: "marie.gleaner@example.be",
  },
  {
    userId: userIds[0],
    message: "Suggestion : ajouter une fonction de messagerie entre agriculteurs et glaneurs",
    email: "farmer.jean@example.be",
  },
  {
    message: "Super initiative pour réduire le gaspillage alimentaire !",
    email: "visiteur@example.be",
  },
];