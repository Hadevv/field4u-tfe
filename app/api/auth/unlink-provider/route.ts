import { requiredAuth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const user = await requiredAuth();
    const { providerId } = await request.json();

    const accounts = await prisma.account.findMany({
      where: {
        userId: user.id,
      },
    });

    const hasPassword = !!user.hashedPassword;
    const totalProviders = accounts.length + (hasPassword ? 1 : 0);

    if (totalProviders <= 1) {
      return NextResponse.json(
        { error: "impossible de supprimer le dernier moyen de connexion" },
        { status: 400 },
      );
    }

    if (providerId === "credentials") {
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          hashedPassword: null,
        },
      });
      return NextResponse.json({ success: true });
    }

    // vérifier que le compte appartient bien à l'utilisateur
    const account = await prisma.account.findUnique({
      where: {
        id: providerId,
      },
    });

    if (!account || account.userId !== user.id) {
      return NextResponse.json(
        { error: "ce provider n'existe pas ou ne vous appartient pas" },
        { status: 403 },
      );
    }

    // supprimer le compte
    await prisma.account.delete({
      where: {
        id: providerId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    return NextResponse.json(
      { error: "une erreur est survenue" },
      { status: 500 },
    );
  }
}
