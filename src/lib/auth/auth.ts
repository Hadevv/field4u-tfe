import { PrismaAdapter } from "@auth/prisma-adapter";
import type { User } from "@prisma/client";
import type { Session } from "next-auth";
import NextAuth from "next-auth";
import { env } from "../env";
import { prisma } from "../prisma";
import { setupResendCustomer, setupStripeCustomer } from "./auth-config-setup";
import { getNextAuthConfigProviders } from "./getNextAuthConfigProviders";
import {
  credentialsOverrideJwt,
  credentialsSignInCallback,
} from "./credentials-provider";
import { cookies } from "next/headers";

export const { handlers, auth: baseAuth } = NextAuth((req) => ({
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    onboarding: "/auth/onboarding",
  },
  adapter: PrismaAdapter(prisma),
  providers: getNextAuthConfigProviders(),
  session: {
    strategy: "database",
  },
  secret: env.NEXTAUTH_SECRET,
  callbacks: {
    session(params) {
      if (params.newSession) return params.session;

      const typedParams = params as unknown as {
        session: Session;
        user?: User;
      };

      if (!typedParams.user) return typedParams.session;

      typedParams.user.hashedPassword = null;

      return typedParams.session;
    },
    async signIn({ user, account, profile }) {
      if (!user.email) return true;

      // recherche d'un utilisateur existant avec le même email
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: { accounts: true },
      });

      // si aucun utilisateur existant, on continue normalement
      // le nom sera vérifié après la connexion sur la page verify-request
      if (!existingUser) {
        return true;
      }

      // si l'utilisateur existe et que le compte n'existe pas encore
      if (existingUser && account && account.provider) {
        // vérifier si ce provider est déjà lié à cet utilisateur
        const existingAccount = existingUser.accounts.find(
          (acc) => acc.provider === account.provider,
        );

        // si le provider n'est pas encore lié, crée le lien
        if (!existingAccount) {
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              refresh_token: account.refresh_token,
            },
          });

          // définir un cookie pour indiquer qu'un compte a été lié
          const cookieStore = cookies();
          (await cookieStore).set("account-linked", "true", {
            maxAge: 60 * 5, // 5 minutes
            path: "/",
          });

          // on continue la connexion normalement, mais on modifie user.id
          // pour utiliser l'id de l'utilisateur existant
          user.id = existingUser.id;

          return true;
        }

        return true;
      }

      return true;
    },
  },
  events: {
    // 🔑 Add this line and the import to add credentials provider
    signIn: credentialsSignInCallback(req),
    createUser: async (message) => {
      const user = message.user;

      if (!user.email) {
        return;
      }

      const stripeCustomerId = await setupStripeCustomer(user);
      const resendContactId = await setupResendCustomer(user);

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          stripeCustomerId,
          resendContactId,
        },
      });
    },
  },
  // 🔑 Add this line and the import to add credentials provider
  jwt: credentialsOverrideJwt,
}));
