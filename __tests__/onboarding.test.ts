/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockPrisma } from "./setup";
import {
  createGleanerAction,
  createFarmAction,
} from "../app/auth/onboarding/onboarding.action";
import { UserRole } from "@prisma/client";
import type { User } from "@prisma/client";

// mock les actions serveur
vi.mock("../app/auth/onboarding/onboarding.action", () => ({
  createGleanerAction: vi.fn(),
  createFarmAction: vi.fn(),
}));

// mock des modules nécessaires
vi.mock("@/lib/auth/helper", () => ({
  requiredAuth: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("onboarding actions", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("createGleanerAction", () => {
    it("met à jour le profil glaneur avec des données valides", async () => {
      // mock de l'utilisateur auth
      const mockUser: Partial<User> = {
        id: "user-id",
        name: null,
        email: "test@example.com",
        onboardingCompleted: false,
      };

      const authHelperMock = await import("@/lib/auth/helper");
      vi.mocked(authHelperMock.requiredAuth).mockResolvedValue(
        mockUser as User,
      );

      // mock de la mise à jour de l'utilisateur
      mockPrisma.user.update.mockResolvedValue({
        ...mockUser,
        name: "jean dupont",
        role: UserRole.GLEANER,
        city: "bruxelles",
        postalCode: "1000",
        termsAcceptedAt: expect.any(Date),
        bio: "description du glaneur",
        acceptGeolocation: true,
        onboardingCompleted: true,
      } as User);

      // mock du retour de l'action serveur
      vi.mocked(createGleanerAction).mockResolvedValue({
        data: {
          message: "inscription terminée",
        },
      } as any);

      // input de test
      const input = {
        bio: "description du glaneur",
        city: "bruxelles",
        postalCode: "1000",
        termsAcceptedAt: new Date(),
        acceptGeolocation: true,
      };

      // appel de l'action serveur
      const result = await createGleanerAction(input);

      // vérification du résultat
      expect(result).toEqual({
        data: {
          message: "inscription terminée",
        },
      });
    });
  });

  describe("createFarmAction", () => {
    it("crée une ferme et met à jour le profil agriculteur", async () => {
      // mock de l'utilisateur auth
      const mockUser: Partial<User> = {
        id: "user-id",
        name: null,
        email: "test@example.com",
        onboardingCompleted: false,
      };

      const authHelperMock = await import("@/lib/auth/helper");
      vi.mocked(authHelperMock.requiredAuth).mockResolvedValue(
        mockUser as User,
      );

      // mock de la mise à jour de l'utilisateur
      mockPrisma.user.update.mockResolvedValue({
        ...mockUser,
        bio: "description de la ferme",
        role: UserRole.FARMER,
        city: "liège",
        postalCode: "4000",
        termsAcceptedAt: expect.any(Date),
        onboardingCompleted: true,
      } as User);

      mockPrisma.farm.create.mockResolvedValue({
        id: "farm-id",
        name: "ma ferme bio",
        slug: "ma-ferme-bio",
        city: "liège",
        postalCode: "4000",
        description: "description de la ferme",
        contactInfo: "contact@ferme.be",
        ownerId: "user-id",
        createdAt: new Date(),
        updatedAt: new Date(),
        latitude: null,
        longitude: null,
      });

      // mock du retour de l'action serveur
      vi.mocked(createFarmAction).mockResolvedValue({
        data: {
          message: "inscription terminée",
        },
      } as any);

      // input de test
      const input = {
        name: "ma ferme bio",
        description: "description de la ferme",
        city: "liège",
        postalCode: "4000",
        contactInfo: "contact@ferme.be",
        termsAcceptedAt: new Date(),
      };

      // appel de l'action serveur
      const result = await createFarmAction(input);

      // vérification du résultat
      expect(result).toEqual({
        data: {
          message: "inscription terminée",
        },
      });
    });
  });
});
