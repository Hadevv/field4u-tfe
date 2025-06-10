import { authRoute } from "@/lib/safe-route";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { Language } from "@prisma/client";

// recuperer le profil PUBLIC de l'utilisateur (informations non sensibles)
export const GET = authRoute.handler(async (req, { data }) => {
  const { user } = data;

  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      name: true,
      bio: true,
      city: true,
      role: true,
      language: true,
      onboardingCompleted: true,
      createdAt: true,
      statistics: {
        select: {
          totalGleanings: true,
          totalFoodSaved: true,
          totalFields: true,
          totalAnnouncements: true,
        },
      },
      // Pas d'email, ID, ou informations personnelles
    },
  });

  return NextResponse.json({
    ...fullUser,
    // Anonymiser certaines données
    createdAt: fullUser?.createdAt.toISOString().split("T")[0], // Seulement la date
  });
});

// mettre a jour le profil PUBLIC uniquement
export const PATCH = authRoute
  .body(
    z.object({
      name: z.string().min(2).max(100).optional(),
      bio: z.string().max(500).optional(),
      city: z.string().max(100).optional(),
      language: z.nativeEnum(Language).optional(),
      // Suppression des champs sensibles comme email, postalCode, etc.
    }),
  )
  .handler(async (req, { body, data }) => {
    const { user } = data;

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: body,
      select: {
        name: true,
        bio: true,
        city: true,
        language: true,
        onboardingCompleted: true,
        // Pas d'informations sensibles
      },
    });

    return NextResponse.json(updatedUser);
  });
