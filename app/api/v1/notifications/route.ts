import { authRoute, RouteError } from "@/lib/safe-route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = authRoute
  .query(
    z.object({
      page: z.coerce.number().default(1),
      limit: z.coerce.number().default(20),
      unreadOnly: z.coerce.boolean().default(false),
    }),
  )
  .handler(async (req, { query, data }) => {
    const { page, limit, unreadOnly } = query;
    const { user } = data;
    const skip = (page - 1) * limit;

    const where = {
      userId: user.id,
      ...(unreadOnly ? { isRead: false } : {}),
    };

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.notification.count({ where }),
    ]);

    return NextResponse.json({
      data: notifications,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        unreadCount: unreadOnly
          ? total
          : await prisma.notification.count({
              where: {
                userId: user.id,
                isRead: false,
              },
            }),
      },
    });
  });

export const PATCH = authRoute
  .body(
    z.object({
      id: z.string(),
      isRead: z.boolean().default(true),
    }),
  )
  .handler(async (req, { body, data }) => {
    const { id, isRead } = body;
    const { user } = data;

    const notification = await prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) {
      throw new RouteError("Notification non trouvée", 404);
    }

    if (notification.userId !== user.id) {
      throw new RouteError(
        "Vous n'êtes pas autorisé à modifier cette notification",
        403,
      );
    }

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: { isRead },
    });

    return NextResponse.json(updatedNotification);
  });

// marquer toutes les notifss comme lues
export const PUT = authRoute.handler(async (req, { data }) => {
  const { user } = data;

  await prisma.notification.updateMany({
    where: {
      userId: user.id,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  return NextResponse.json({ success: true });
});
