import type { User } from "@prisma/client";
import { baseAuth } from "./auth";
import { UserRole } from "@prisma/client";

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
  }
}
// verifie dans la session si l'utilisateur est authentifié
export const auth = async () => {
  const session = await baseAuth();

  if (session?.user) {
    const user = session.user as User;
    return user;
  }

  return null;
};
// verifie si authentifié et retourne l'utilisateur
export const requiredAuth = async () => {
  const user = await auth();

  if (!user) {
    throw new AuthError("You must be authenticated to access this resource.");
  }

  return user;
};
// verifie le role de l'utilisateur authentifié et retourne l'utilisateur
export const requiredRole = async (role: UserRole) => {
  const user = await requiredAuth();

  if (user.role !== role) {
    throw new AuthError(`You do not have the '${role}' role to access this resource.`);
  }

  return user;
};

// verifie si l'utilisateur est admin
export const isAdmin = async () => requiredRole(UserRole.ADMIN);
// verifie si l'utilisateur est agriculteur
export const isFarmer = async () => requiredRole(UserRole.FARMER);
// verifie si l'utilisateur est glaneur
export const isGleaner = async () => requiredRole(UserRole.GLEANER);