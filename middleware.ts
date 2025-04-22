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
    pathname === "/auth/error"
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
  } catch (error) {
    console.error("Erreur dans le middleware:", error);
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
