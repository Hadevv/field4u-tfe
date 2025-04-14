import { authRoute } from "@/lib/safe-route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { UserRole, Language } from "@prisma/client";

// recuperer le profil de l'utilisateur
export const GET = authRoute.handler(async (req, { data }) => {
  const { user } = data;

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      city: true,
      postalCode: true,
      role: true,
      language: true,
      onboardingCompleted: true,
      createdAt: true,
      statistics: true,
    },
  });

  return NextResponse.json(fullUser);
});

// mettre a jour le profil
export const PATCH = authRoute
  .body(
    z.object({
      name: z.string().optional(),
      bio: z.string().optional(),
      city: z.string().optional(),
      postalCode: z.string().optional(),
      role: z.nativeEnum(UserRole).optional(),
      language: z.nativeEnum(Language).optional(),
      acceptGeolocation: z.boolean().optional(),
      image: z.string().optional(),
    }),
  )
  .handler(async (req, { body, data }) => {
    const { user } = data;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: body,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        city: true,
        postalCode: true,
        role: true,
        language: true,
        acceptGeolocation: true,
        onboardingCompleted: true,
        createdAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  });
