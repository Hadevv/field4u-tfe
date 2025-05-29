import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/auth.const";

// Routes qui nécessitent une authentification
const PROTECTED_ROUTES = ["/admin", "/(account)", "/(farmer)", "/my-gleanings"];

// Pages exemptées du contrôle d'onboarding
const ONBOARDING_EXEMPTIONS = [
  "/auth/onboarding",
  "/auth/signin",
  "/auth/signout",
  "/auth",
  "/api",
];

/**
 * Middleware qui gère l'authentification et l'onboarding
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorer les routes API
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Récupérer le token de session
  const sessionToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // Vérifier les routes protégées
  for (const route of PROTECTED_ROUTES) {
    if (pathname.startsWith(route)) {
      if (!sessionToken) {
        const redirectUrl = new URL("/auth/signin", request.url);
        redirectUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  // Contrôle de l'onboarding pour les utilisateurs connectés
  if (sessionToken) {
    // Vérifier les exemptions
    for (const exemption of ONBOARDING_EXEMPTIONS) {
      if (pathname.startsWith(exemption)) {
        return NextResponse.next();
      }
    }

    // Vérifier le cache d'onboarding
    const onboardingCompleted = request.cookies.get(
      "onboardingCompleted",
    )?.value;

    if (onboardingCompleted === "true") {
      return NextResponse.next();
    }

    // Vérifier le statut d'onboarding en base
    try {
      const response = await fetch(
        new URL("/api/v1/auth/session", request.url).toString(),
        { headers: { cookie: request.headers.get("cookie") || "" } },
      );

      if (response.ok) {
        const userData = await response.json();

        if (userData?.onboardingCompleted === true) {
          const res = NextResponse.next();
          res.cookies.set("onboardingCompleted", "true", {
            maxAge: 60 * 60 * 24 * 7, // 7 jours
            path: "/",
          });
          return res;
        }

        if (userData?.onboardingCompleted === false) {
          return NextResponse.redirect(
            new URL("/auth/onboarding", request.url),
          );
        }
      }
    } catch (error) {
      console.error("Middleware error:", error);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|fonts/|.*\\.(?:jpg|jpeg|gif|png|svg|ico|css|js)$).*)",
  ],
};
