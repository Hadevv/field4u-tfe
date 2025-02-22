export const createFields = (
  farmIds: string[],
  cropTypeIds: string[],
  userIds: string[],
) => [
  // Champ lié à une FERME (farmId défini, ownerId = null)
  {
    name: "Champ Principal",
    description: "Grand champ de pommes de terre",
    city: "Namur",
    postalCode: "5000",
    latitude: 50.4673883,
    longitude: 4.8719854,
    cropTypeId: cropTypeIds[0],
    farmId: null,
    ownerId: userIds[0],
  },
  // Champ lié à un UTILISATEUR (ownerId défini, farmId = null)
  {
    name: "Verger Est",
    description: "Verger de pommiers",
    city: "Gembloux",
    postalCode: "5030",
    latitude: 50.5590556,
    longitude: 4.6999974,
    cropTypeId: cropTypeIds[2],
    farmId: farmIds[1],
    ownerId: null,
  },
];
