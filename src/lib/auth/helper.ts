import type { User } from "@prisma/client";
import { baseAuth } from "./auth";
import { UserRole } from "@prisma/client";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export const auth = async () => {
  const session = await baseAuth();

  if (session?.user) {
    const user = session.user as User;
    return user;
  }

  return null;
};

export const requiredAuth = async () => {
  const user = await auth();

  if (!user) {
    throw new AuthError("You must be authenticated to access this resource.");
  }

  return user;
};

export const requiredRole = async (role: UserRole) => {
  const user = await requiredAuth();

  if (user.role !== role) {
    throw new AuthError(`You do not have the '${role}' role to access this resource.`);
  }

  return user;
};

// 🔑 Add these functions to check for specific roles
export const isAdmin = async () => requiredRole(UserRole.ADMIN);
export const isFarmer = async () => requiredRole(UserRole.AGRICULTEUR);
export const isGleaner = async () => requiredRole(UserRole.GLANEUR);