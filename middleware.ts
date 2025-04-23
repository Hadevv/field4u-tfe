import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth/auth.const";

function shouldSkipRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    pathname === "/auth/verify-request" ||
    pathname === "/auth/signin" ||
    pathname === "/auth/signup" ||
    pathname === "/auth/signout" ||
    pathname === "/auth/error" ||
    pathname === "/auth/onboarding"
  );
}

function isProtectedRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/my-gleanings") ||
    pathname.startsWith("/announcements/create") ||
    pathname.startsWith("/(account)") ||
    pathname.startsWith("/(farmer)")
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (shouldSkipRoute(pathname)) {
    return NextResponse.next();
  }

  try {
    const sessionToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (isProtectedRoute(pathname) && !sessionToken) {
      const redirectUrl = new URL("/auth/signin", request.url);
      redirectUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    if (sessionToken && pathname === "/auth") {
      const redirectUrl = new URL("/", request.url);
      return NextResponse.redirect(redirectUrl);
    }

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
          console.log("redirection vers onboarding pour:", userData.email);
          const onboardingUrl = new URL("/auth/onboarding", request.url);
          if (pathname !== "/") {
            onboardingUrl.searchParams.set("callbackUrl", pathname);
          }
          return NextResponse.redirect(onboardingUrl);
        }
      }
    }
  } catch (error) {
    console.error("erreur dans le middleware:", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (public images folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
