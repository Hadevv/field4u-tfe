/* eslint-disable @typescript-eslint/no-explicit-any */

import { Prisma, PrismaClient } from '@prisma/client';

export type Context = {
  prisma: PrismaClient;
  data: {
    users: Prisma.UserCreateInput[];
    farms: Prisma.FarmCreateInput[];
    cropTypes: Prisma.CropTypeCreateInput[];
    fields: Prisma.FieldCreateInput[];
    glanagePeriods: Prisma.GlanagePeriodCreateInput[];
    announcements: Prisma.AnnouncementCreateInput[];
    participations: Prisma.ParticipationCreateInput[];
    glanages: Prisma.GlanageCreateInput[];
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
    users: any[];
    farms: any[];
    cropTypes: any[];
    fields: any[];
    glanagePeriods: any[];
    announcements: any[];
    participations: any[];
    glanages: any[];
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