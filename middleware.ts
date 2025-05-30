import { NextResponse, type NextRequest } from "next/server";

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
 * Vérifie si une route nécessite une authentification
 */
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

/**
 * Middleware qui gère l'authentification et l'onboarding
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorer les routes API
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Vérifier si la route nécessite une authentification
  const requiresAuth = isProtectedRoute(pathname);

  try {
    const response = await fetch(
      new URL("/api/session", request.url).toString(),
      { headers: { cookie: request.headers.get("cookie") || "" } },
    );

    if (response.ok) {
      const userData = await response.json();

      // Si la route nécessite une authentification et l'utilisateur n'est pas connecté
      if (requiresAuth && !userData?.id) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
      }

      // Si l'utilisateur est connecté, vérifier l'onboarding
      if (userData?.id) {
        // Vérifier les exemptions d'onboarding
        const isExempted = ONBOARDING_EXEMPTIONS.some((exemption) =>
          pathname.startsWith(exemption),
        );

        // Si l'utilisateur n'a pas terminé l'onboarding et n'est pas sur une page exemptée
        if (!isExempted && userData?.onboardingCompleted === false) {
          return NextResponse.redirect(
            new URL("/auth/onboarding", request.url),
          );
        }
      }
    } else {
      // Si l'API session échoue et que la route nécessite une authentification
      if (requiresAuth) {
        return NextResponse.redirect(new URL("/auth/signin", request.url));
      }
    }
  } catch (error) {
    console.error("Middleware error:", error);

    // En cas d'erreur, rediriger vers signin si la route est protégée
    if (requiresAuth) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|fonts/|.*\\.(?:jpg|jpeg|gif|png|svg|ico|css|js)$).*)",
  ],
};
