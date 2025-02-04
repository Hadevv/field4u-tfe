export const createGleaningPeriods = (fieldIds: string[]) => [
  {
    fieldId: fieldIds[0],
    startDate: new Date('2024-09-01'),
    endDate: new Date('2024-09-30'),
  },
  {
    fieldId: fieldIds[1],
    startDate: new Date('2024-10-01'),
    endDate: new Date('2024-10-31'),
  },
];