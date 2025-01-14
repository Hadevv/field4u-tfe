export const createFields = (
  farmIds: string[],
  cropTypeIds: string[],
  userIds: string[]
) => [
  {
    name: 'Champ Principal',
    description: 'Grand champ de pommes de terre',
    city: 'Namur',
    postal_code: '5000',
    latitude: 50.4673883,
    longitude: 4.8719854,
    cropTypeId: cropTypeIds[0],
    farmId: farmIds[0],
    ownerId: userIds[0],
  },
  {
    name: 'Verger Est',
    description: 'Verger de pommiers',
    city: 'Gembloux',
    postal_code: '5030',
    latitude: 50.5590556,
    longitude: 4.6999974,
    cropTypeId: cropTypeIds[2],
    farmId: farmIds[1],
    ownerId: userIds[3],
  },
];