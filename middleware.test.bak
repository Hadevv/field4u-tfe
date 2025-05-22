import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/auth.const";

// Routes techniques
const IGNORE_PATTERNS = [
  ".",
  "/_next",
  "/api",
  "/static",
  "/favicon.ico",
  "/images",
  "@modal",
  "(.)",
];

// Routes protégées
const PROTECTED_ROUTES = [
  "/admin",
  "/announcements/create",
  "/(account)",
  "/(farmer)",
];

// Routes pour l'onboarding verif
const ONBOARDING_EXEMPTIONS = [
  "/auth/onboarding",
  "/auth/signin",
  "/auth/signout",
  "/auth",
  "/api",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  for (const pattern of IGNORE_PATTERNS) {
    if (pathname.includes(pattern)) {
      return NextResponse.next();
    }
  }

  // Récupérer le token de session
  const sessionToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  for (const route of PROTECTED_ROUTES) {
    if (pathname.startsWith(route)) {
      if (!sessionToken) {
        const redirectUrl = new URL("/auth/signin", request.url);
        redirectUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  if (sessionToken) {
    for (const exemption of ONBOARDING_EXEMPTIONS) {
      if (pathname.startsWith(exemption)) {
        return NextResponse.next();
      }
    }

    try {
      const response = await fetch(
        new URL("/api/v1/auth/session", request.url).toString(),
        { headers: { cookie: request.headers.get("cookie") || "" } },
      );

      if (response.ok) {
        const userData = await response.json();

        // Si l'onboarding n'est pas terminé, rediriger
        if (
          userData &&
          userData.user &&
          userData.user.onboardingCompleted === false
        ) {
          return NextResponse.redirect(
            new URL("/auth/onboarding", request.url),
          );
        }
      }
    } catch (error) {
      // Ne pas bloquer la navigation si la vérification échoue
      console.error("Middleware error:", error);
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/|@modal/).*)"],
};
