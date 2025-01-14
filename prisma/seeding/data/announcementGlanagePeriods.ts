export const createAnnouncementGlanagePeriods = (
  announcementIds: string[],
  glanagePeriodIds: string[]
) => [
  {
    announcementId: announcementIds[0],
    glanagePeriodId: glanagePeriodIds[0],
  },
  {
    announcementId: announcementIds[1],
    glanagePeriodId: glanagePeriodIds[1],
  },
];