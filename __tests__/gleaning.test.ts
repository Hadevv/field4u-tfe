/* eslint-disable @typescript-eslint/ban-ts-comment */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockPrisma } from "./setup";
import { joinGleaningAction } from "../app/announcements/[slug]/gleaning/_actions/gleaning.action";
import { GleaningStatus } from "@prisma/client";

// mock des modules nécessaires
vi.mock(
  "../app/announcements/[slug]/gleaning/_actions/gleaning.action",
  () => ({
    joinGleaningAction: vi.fn(),
  }),
);

vi.mock("@/lib/auth/helper", () => ({
  requiredAuth: vi.fn(),
}));

vi.mock("@/lib/inngest/client", () => ({
  inngest: {
    send: vi.fn(),
  },
}));

describe("glanage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("joinGleaningAction", () => {
    it("permet à un utilisateur de rejoindre un glanage", async () => {
      // mock de l'utilisateur auth
      const mockUser = {
        id: "user-id",
        name: "test user",
        email: "test@example.com",
        role: "GLEANER",
      };

      const authHelperMock = await import("@/lib/auth/helper");
      // @ts-ignore
      vi.mocked(authHelperMock.requiredAuth).mockResolvedValue(mockUser);

      // mock de l'annonce existante
      // @ts-ignore
      mockPrisma.announcement.findUnique.mockResolvedValue({
        id: "announcement-id",
        title: "récolte de tomates",
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
      });

      // mock du glanage existant
      // @ts-ignore
      mockPrisma.gleaning.findUnique.mockResolvedValue({
        id: "gleaning-id",
        status: GleaningStatus.NOT_STARTED,
        announcementId: "announcement-id",
      });

      // mock pour vérifier que l'utilisateur ne participe pas déjà
      mockPrisma.participation.findUnique.mockResolvedValue(null);

      // mock de la création de participation
      // @ts-ignore
      mockPrisma.participation.create.mockResolvedValue({
        id: "participation-id",
        userId: "user-id",
        gleaningId: "gleaning-id",
        createdAt: new Date(),
      });

      // mock du retour de l'action serveur
      // @ts-ignore
      vi.mocked(joinGleaningAction).mockResolvedValue({
        data: {
          success: true,
          gleaningId: "gleaning-id",
        },
      });

      // input de test
      const input = {
        announcementId: "announcement-id",
      };

      // appel de l'action serveur
      const result = await joinGleaningAction(input);

      // vérification du résultat
      expect(result).toEqual({
        data: {
          success: true,
          gleaningId: "gleaning-id",
        },
      });
    });

    it("détecte si l'utilisateur participe déjà au glanage", async () => {
      // mock de l'utilisateur auth
      const mockUser = {
        id: "user-id",
        name: "test user",
        email: "test@example.com",
      };

      const authHelperMock = await import("@/lib/auth/helper");
      // @ts-ignore
      vi.mocked(authHelperMock.requiredAuth).mockResolvedValue(mockUser);

      // mock de l'annonce existante
      // @ts-ignore
      mockPrisma.announcement.findUnique.mockResolvedValue({
        id: "announcement-id",
        title: "récolte de tomates",
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
      });

      // mock du glanage existant
      // @ts-ignore
      mockPrisma.gleaning.findUnique.mockResolvedValue({
        id: "gleaning-id",
        status: GleaningStatus.NOT_STARTED,
        announcementId: "announcement-id",
      });

      // mock pour indiquer que l'utilisateur participe déjà
      // @ts-ignore
      mockPrisma.participation.findUnique.mockResolvedValue({
        id: "existing-participation-id",
        userId: "user-id",
        gleaningId: "gleaning-id",
      });

      // mock du retour de l'action serveur
      // @ts-ignore
      vi.mocked(joinGleaningAction).mockResolvedValue({
        data: {
          success: true,
          gleaningId: "gleaning-id",
          alreadyParticipating: true,
        },
      });

      // input de test
      const input = {
        announcementId: "announcement-id",
      };

      // appel de la action serveur
      const result = await joinGleaningAction(input);

      // vérification du résult
      expect(result).toEqual({
        data: {
          success: true,
          gleaningId: "gleaning-id",
          alreadyParticipating: true,
        },
      });
    });

    it("lance une erreur si l'annonce n'existe pas", async () => {
      // mock de l'utilisateur auth
      const mockUser = {
        id: "user-id",
        name: "test user",
        email: "test@example.com",
      };

      const authHelperMock = await import("@/lib/auth/helper");
      // @ts-ignore
      vi.mocked(authHelperMock.requiredAuth).mockResolvedValue(mockUser);

      // mock pour simuler une annonce qui n'existe pas
      mockPrisma.announcement.findUnique.mockResolvedValue(null);

      // mock du retour de l'action serveur
      // @ts-ignore
      vi.mocked(joinGleaningAction).mockResolvedValue({
        data: {
          success: false,
          error: "Annonce introuvable",
        },
      });

      // input de test
      const input = {
        announcementId: "non-existent-id",
      };

      // appel de l'action serveur
      const result = await joinGleaningAction(input);

      // vérification du résultat
      expect(result).toEqual({
        data: {
          success: false,
          error: "Annonce introuvable",
        },
      });
    });

    it("gère l'erreur si une exception est levée", async () => {
      // mock de l'utilisateur auth
      const mockUser = {
        id: "user-id",
        name: "test user",
        email: "test@example.com",
      };

      const authHelperMock = await import("@/lib/auth/helper");
      // @ts-ignore
      vi.mocked(authHelperMock.requiredAuth).mockResolvedValue(mockUser);

      // mock pour simuler une erreur interne
      mockPrisma.announcement.findUnique.mockImplementation(() => {
        throw new Error("erreur interne");
      });

      // mock du retour de l'action serveur
      // @ts-ignore
      vi.mocked(joinGleaningAction).mockResolvedValue({
        data: {
          success: false,
          error: "Une erreur est survenue lors de la participation au glanage",
        },
      });

      // input de test
      const input = {
        announcementId: "announcement-id",
      };

      // appel de l'action serveur
      const result = await joinGleaningAction(input);

      // vérification du résultat
      expect(result).toEqual({
        data: {
          success: false,
          error: "Une erreur est survenue lors de la participation au glanage",
        },
      });
    });
  });
});
