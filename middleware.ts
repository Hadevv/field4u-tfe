import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth/auth.const";
import { prisma } from "@/lib/prisma";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    pathname === "/auth/verify-request" ||
    pathname === "/auth/signin" ||
    pathname === "/auth/signup" ||
    pathname === "/auth/signout" ||
    pathname === "/auth/error"
  ) {
    return NextResponse.next();
  }
  try {
    const cookieStore = cookies();
    const sessionToken = (await cookieStore).get(AUTH_COOKIE_NAME)?.value;

    if (sessionToken) {
      const session = await prisma.session.findUnique({
        where: {
          sessionToken,
        },
        include: {
          user: true,
        },
      });

      if (session?.user && session.user.name === null) {
        const redirectUrl = new URL("/auth/verify-request", request.url);
        redirectUrl.searchParams.set("email", session.user.email);
        return NextResponse.redirect(redirectUrl);
      }
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
