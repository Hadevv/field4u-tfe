import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/helper";

// Endpoint pour le middleware - utilise NextAuth directement
export const GET = async () => {
  try {
    const user = await auth();

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      onboardingCompleted: user.onboardingCompleted,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la session:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
};
