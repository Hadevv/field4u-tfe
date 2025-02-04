/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma, PrismaClient } from '@prisma/client';

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
    statistics: Prisma.StatisticsCreateInput[];
    feedbacks: Prisma.FeedbackCreateInput[];
    notifications: Prisma.NotificationCreateInput[];
    agendas: Prisma.AgendaCreateInput[];
    comments: Prisma.CommentCreateInput[];
    likes: Prisma.LikeCreateInput[];
    favorites: Prisma.FavoriteCreateInput[];
  };
  created: {
    glanages: any;
    users: any[];
    farms: any[];
    cropTypes: any[];
    fields: any[];
    gleaningPeriods: any[];
    announcements: any[];
    participations: any[];
    gleanings: any[];
    reviews: any[];
    statistics: any[];
    feedbacks: any[];
    notifications: any[];
    agendas: any[];
    comments: any[];
    likes: any[];
    favorites: any[];
  };
};