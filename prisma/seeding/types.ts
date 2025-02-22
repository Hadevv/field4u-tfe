import {
  Prisma,
  PrismaClient,
  User,
  Farm,
  CropType,
  Field,
  GleaningPeriod,
  Announcement,
  Participation,
  Gleaning,
  Review,
  Statistic,
  Feedback,
  Notification,
  Agenda,
  Comment,
  Like,
  Favorite,
} from "@prisma/client";

export type Context = {
  prisma: PrismaClient;
  data: {
    users: Prisma.UserCreateInput[];
    farms: Prisma.FarmCreateInput[];
    cropTypes: Prisma.CropTypeCreateInput[];
    fields: Prisma.FieldCreateInput[];
    gleaningPeriods: Prisma.GleaningPeriodCreateInput[];
    announcements: Prisma.AnnouncementCreateInput[];
    participations: Prisma.ParticipationCreateInput[];
    gleanings: Prisma.GleaningCreateInput[];
    reviews: Prisma.ReviewCreateInput[];
    statistics: Prisma.StatisticCreateInput[];
    feedbacks: Prisma.FeedbackCreateInput[];
    notifications: Prisma.NotificationCreateInput[];
    agendas: Prisma.AgendaCreateInput[];
    comments: Prisma.CommentCreateInput[];
    likes: Prisma.LikeCreateInput[];
    favorites: Prisma.FavoriteCreateInput[];
  };
  created: {
    users: User[];
    farms: Farm[];
    cropTypes: CropType[];
    fields: Field[];
    gleaningPeriods: GleaningPeriod[];
    announcements: Announcement[];
    participations: Participation[];
    gleanings: Gleaning[];
    reviews: Review[];
    statistics: Statistic[];
    feedbacks: Feedback[];
    notifications: Notification[];
    agendas: Agenda[];
    comments: Comment[];
    likes: Like[];
    favorites: Favorite[];
  };
};
