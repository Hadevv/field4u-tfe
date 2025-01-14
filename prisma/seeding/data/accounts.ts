export const createAccounts = (userIds: string[]) => [
  {
    userId: userIds[0],
    type: 'credentials',
    provider: 'credentials',
    providerAccountId: '1',
  },
  {
    userId: userIds[1],
    type: 'credentials',
    provider: 'credentials',
    providerAccountId: '2',
  },
];