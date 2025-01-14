export const createStatistics = (userIds: string[]) => 
  userIds.map(userId => ({
    userId,
    totalGlanages: 0,
    totalFoodSaved: 0,
    totalFields: 0,
    totalAnnouncements: 0,
  }));