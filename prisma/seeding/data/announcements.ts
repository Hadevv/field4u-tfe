export const createAnnouncements = (
  fieldIds: string[],
  cropTypeIds: string[],
  userIds: string[]
) => [
  {
    title: 'Glanage de pommes de terre',
    description: 'Venez glaner des pommes de terre bio après la récolte principale',
    fieldId: fieldIds[0],
    cropTypeId: cropTypeIds[0],
    ownerId: userIds[0],
    quantityAvailable: 500,
  },
  {
    title: 'Pommes à glaner',
    description: 'Pommes non récoltées disponibles pour le glanage',
    fieldId: fieldIds[1],
    cropTypeId: cropTypeIds[2],
    ownerId: userIds[3],
    quantityAvailable: 300,
  },
];