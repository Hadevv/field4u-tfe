import { UserRole } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      email: string;
      name?: string;
      image?: string;
      role: UserRole;
      onboardingCompleted: boolean;
    };
  }
}
