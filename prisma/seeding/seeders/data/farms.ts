export const createFarms = (userIds: string[]) => [
  {
    name: "Ferme du Bonheur",
    description:
      "Ferme biologique familiale spécialisée dans les légumes de saison",
    city: "Namur",
    postalCode: "5000",
    contactInfo: "+32 123 456 789",
    latitude: 50.4673883,
    longitude: 4.8719854,
    ownerId: userIds[0],
  },
  {
    name: "Les Vergers de Pierre",
    description: "Vergers traditionnels de pommes et poires",
    city: "Gembloux",
    postalCode: "5030",
    contactInfo: "+32 987 654 321",
    latitude: 50.5590556,
    longitude: 4.6999974,
    ownerId: userIds[3],
  },
];
