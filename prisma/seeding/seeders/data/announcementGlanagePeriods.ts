export const createAnnouncementGlanagePeriods = (
  announcementIds: string[],
  gleaningsPeriodIds: string[],
) => [
  {
    announcementId: announcementIds[0],
    gleaningPeriodId: gleaningsPeriodIds[0],
  },
  {
    announcementId: announcementIds[1],
    gleaningPeriodId: gleaningsPeriodIds[1],
  },
];
