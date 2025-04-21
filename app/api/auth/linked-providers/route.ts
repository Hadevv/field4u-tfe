import { requiredAuth } from "@/lib/auth/helper";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await requiredAuth();

    const accounts = await prisma.account.findMany({
      where: {
        userId: user.id,
      },
      select: {
        id: true,
        provider: true,
        type: true,
      },
    });

    const hasPassword = !!user.hashedPassword;

    const providers = [
      ...accounts.map((account) => ({
        id: account.id,
        name: getProviderName(account.provider),
        type: account.provider,
      })),
    ];

    if (hasPassword) {
      providers.push({
        id: "credentials",
        name: "Email + Mot de passe",
        type: "credentials",
      });
    }

    return NextResponse.json(providers);
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

function getProviderName(provider: string): string {
  switch (provider) {
    case "github":
      return "GitHub";
    case "google":
      return "Google";
    case "resend":
      return "Magic Link (Email)";
    default:
      return provider.charAt(0).toUpperCase() + provider.slice(1);
  }
}
