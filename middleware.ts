import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/auth/:path*",
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - admin/login (login page)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|admin/login).*)",
  ],
};

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Ajouter x-url uniquement pour le debug
  if (process.env.NODE_ENV === "development") {
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set("x-url", req.url);
  }

  // Autoriser l'accès à la page de connexion
  if (pathname === "/auth/signin") {
    return NextResponse.next();
  }

  // Protéger les routes API d'auth uniquement si nécessaire
  if (pathname.startsWith("/api/auth") && !token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Rediriger si non authentifié et tentative d'accès à une page protégée
  if (!token && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next();
}
