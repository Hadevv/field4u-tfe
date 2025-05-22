import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/auth.const";

// Routes protégées
const PROTECTED_ROUTES = ["/admin", "/(account)", "/(farmer)", "/my-gleanings"];

const ONBOARDING_EXEMPTIONS = [
  "/auth/onboarding",
  "/auth/signin",
  "/auth/signout",
  "/auth",
  "/api",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ignorer les chemins API
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Récupérer le token de session
  const sessionToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  // vérifier les routes protégées
  for (const route of PROTECTED_ROUTES) {
    if (pathname.startsWith(route)) {
      if (!sessionToken) {
        const redirectUrl = new URL("/auth/signin", request.url);
        redirectUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(redirectUrl);
      }
    }
  }

  // vérifier l'onboarding
  if (sessionToken) {
    // ignorer les exemptions d'onboarding
    for (const exemption of ONBOARDING_EXEMPTIONS) {
      if (pathname.startsWith(exemption)) {
        return NextResponse.next();
      }
    }

    // vérifier si onboarding déjà validé via cookie
    const onboardingCompleted = request.cookies.get(
      "onboardingCompleted",
    )?.value;
    if (onboardingCompleted === "true") {
      return NextResponse.next();
    }

    try {
      const response = await fetch(
        new URL("/api/v1/auth/session", request.url).toString(),
        { headers: { cookie: request.headers.get("cookie") || "" } },
      );

      if (response.ok) {
        const userData = await response.json();

        // Si l'onboarding est terminé, sauvegarder en cookie
        if (userData?.user?.onboardingCompleted === true) {
          const res = NextResponse.next();
          res.cookies.set("onboardingCompleted", "true", {
            maxAge: 60 * 60 * 24 * 7, // 7 jours
            path: "/",
          });
          return res;
        }

        // Si l'onboarding n'est pas terminé, rediriger
        if (userData?.user?.onboardingCompleted === false) {
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

// exclure les assets, API et autres ressources statiques
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|fonts/|.*\\.(?:jpg|jpeg|gif|png|svg|ico|css|js)$).*)",
  ],
};
