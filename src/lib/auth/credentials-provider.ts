import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { env } from "../env";
import { prisma } from "../prisma";
import { AUTH_COOKIE_NAME } from "./auth.const";

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

export const validatePassword = (password: string) => {
  return PASSWORD_REGEX.test(password);
};

export const hashPassword = async (password: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};

export const getCredentialsProvider = () => {
  return CredentialsProvider({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "text", placeholder: "Your email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      const email = String(credentials.email);
      const password = String(credentials.password);

      const user = await prisma.user.findUnique({
        where: { email },
        include: { accounts: true },
      });

      if (!user) return null;

      // si l'utilisateur existe mais n'a pas de mot de passe,
      // vérifier s'il a un compte avec un autre provider
      if (!user.hashedPassword) {
        // l'utilisateur existe via un autre provider (oauth ou magic link)
        // mais n'a pas encore de mot de passe défini
        // on peut soit refuser la connexion, soit continuer avec le compte existant
        return null;
      }

      const passwordMatch = await comparePassword(
        password,
        user.hashedPassword as string,
      );
      if (!passwordMatch) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role as UserRole,
        onboardingCompleted: user.onboardingCompleted,
      };
    },
  });
};

type SignInCallback = NonNullable<NextAuthConfig["events"]>["signIn"];
type JwtOverride = NonNullable<NextAuthConfig["jwt"]>;

export const credentialsSignInCallback =
  (request: NextRequest | undefined): SignInCallback =>
  async ({ user }) => {
    if (!request || request.method !== "POST") return;

    const currentUrl = request.url;
    if (!currentUrl.includes("credentials") || !currentUrl.includes("callback"))
      return;

    const uuid = nanoid();
    const expireAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.session.create({
      data: {
        sessionToken: uuid,
        userId: user.id ?? "",
        expires: expireAt,
      },
    });

    const cookieList = await cookies();

    cookieList.set(AUTH_COOKIE_NAME, uuid, {
      expires: expireAt,
      path: "/",
      sameSite: "lax",
      httpOnly: true,
      secure: env.NODE_ENV === "production",
    });

    return;
  };

// Désactive la stratégie JWT par défaut
export const credentialsOverrideJwt: JwtOverride = {
  encode() {
    return "";
  },
  async decode() {
    return null;
  },
};
