import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/auth.const";

/**
 * Routes à ignorer complètement par le middleware
 */
function shouldSkipRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico" ||
    pathname === "/auth" ||
    pathname === "/auth/verify-request" ||
    pathname === "/auth/signin" ||
    pathname === "/auth/signup" ||
    pathname === "/auth/signout" ||
    pathname === "/auth/error" ||
    pathname === "/auth/onboarding"
  );
}

/**
 * Routes nécessitant une session authentifiée
 */
function isProtectedRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/my-gleanings") ||
    pathname.startsWith("/announcements/create") ||
    pathname.startsWith("/(account)") ||
    pathname.startsWith("/(farmer)")
  );
}

/**
 * Middleware principal
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bypass pour les routes publiques
  if (shouldSkipRoute(pathname)) {
    return NextResponse.next();
  }

  try {
    const sessionToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    // Redirection vers /auth/signin si non-auth pour route protégée
    if (isProtectedRoute(pathname) && !sessionToken) {
      const redirectUrl = new URL("/auth/signin", request.url);
      redirectUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Si déjà connecté et va sur /auth, rediriger vers home
    if (sessionToken && pathname === "/auth") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Redirection vers onboarding si pas encore complété
    if (
      sessionToken &&
      !pathname.startsWith("/auth/") &&
      !pathname.startsWith("/api/")
    ) {
      const sessionUrl = new URL("/api/v1/auth/session", request.url);
      const response = await fetch(sessionUrl.toString(), {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });

      if (response.ok) {
        const userData = await response.json();

        if (userData && userData.onboardingCompleted === false) {
          const onboardingUrl = new URL("/auth/onboarding", request.url);
          if (pathname !== "/") {
            onboardingUrl.searchParams.set("callbackUrl", pathname);
          }
          return NextResponse.redirect(onboardingUrl);
        }
      }
    }
  } catch (error) {
    console.error("Middleware error:", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Exclure les assets publics
     */
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
