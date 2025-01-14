export const createSessions = (userIds: string[]) => [
  {
    userId: userIds[0],
    sessionToken: 'session-token-1',
    expires: new Date('2024-12-31'),
  },
  {
    userId: userIds[1],
    sessionToken: 'session-token-2',
    expires: new Date('2024-12-31'),
  },
];