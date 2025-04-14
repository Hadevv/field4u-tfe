import { authRoute } from "@/lib/safe-route";
import { NextResponse } from "next/server";

// recup les informations de l'utilisateur
export const GET = authRoute.handler(async (req, { data }) => {
  const { user } = data;

  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    image: user.image,
    role: user.role,
    onboardingCompleted: user.onboardingCompleted,
  });
});
