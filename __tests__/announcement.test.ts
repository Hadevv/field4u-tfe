/* eslint-disable @typescript-eslint/ban-ts-comment */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { mockPrisma } from "./setup";
import { createAnnouncementAction } from "../app/(farmer)/farm/announcements/new/create-announcement.action";
import { deleteAnnouncementAction } from "../app/(farmer)/farm/announcements/delete-announcement.action";
import { UserRole } from "@prisma/client";

// mock des actions serveur
vi.mock(
  "../app/(farmer)/farm/announcements/new/create-announcement.action",
  () => ({
    createAnnouncementAction: vi.fn(),
  }),
);

vi.mock(
  "../app/(farmer)/farm/announcements/delete-announcement.action",
  () => ({
    deleteAnnouncementAction: vi.fn(),
  }),
);

// mock des modules
vi.mock("@/lib/auth/helper", () => ({
  isFarmer: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/format/id", () => ({
  generateSlug: vi.fn((title) =>
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, ""),
  ),
}));

vi.mock("@/features/upload/upload-new", () => ({
  uploadManager: {
    uploadFiles: vi.fn(),
  },
}));

describe("annonces", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe("createAnnouncementAction", () => {
    it("crée une annonce avec les données valides d'un agriculteur", async () => {
      // mock user farmer
      const mockUser = {
        id: "farmer-id",
        name: "agriculteur test",
        email: "farmer@example.com",
        role: UserRole.FARMER,
      };

      const authHelperMock = await import("@/lib/auth/helper");
      // @ts-ignore
      vi.mocked(authHelperMock.isFarmer).mockResolvedValue(mockUser);

      // mock du field existant
      // @ts-ignore
      mockPrisma.field.findFirst.mockResolvedValue({
        id: "field-id",
        name: "parcelle test",
        farmId: "farm-id",
      });

      // mock pour vérifier le slug unique
      mockPrisma.announcement.findUnique.mockResolvedValue(null);

      // mock pour la création de l'annonce
      // @ts-ignore
      mockPrisma.announcement.create.mockResolvedValue({
        id: "new-announcement-id",
        title: "récolte de tomates",
        slug: "recolte-de-tomates",
        description: "venez récolter nos tomates bio",
        fieldId: "field-id",
        cropTypeId: "crop-type-id",
        ownerId: "farmer-id",
        isPublished: true,
      });

      // mock pour la création du glanage
      // @ts-ignore
      mockPrisma.gleaning.create.mockResolvedValue({
        id: "gleaning-id",
        announcementId: "new-announcement-id",
        status: "NOT_STARTED",
      });

      // mock pour la mise à jour des statistiques
      // @ts-ignore
      mockPrisma.statistic.upsert.mockResolvedValue({
        userId: "farmer-id",
        totalAnnouncements: 1,
      });

      // mock pour le retour de l'action serveur
      // @ts-ignore
      vi.mocked(createAnnouncementAction).mockResolvedValue({
        data: {
          success: true,
          announcementId: "new-announcement-id",
        },
      });

      // input de test
      const input = {
        title: "Récolte de tomates",
        description: "Venez récolter nos tomates bio",
        fieldId: "field-id",
        cropTypeId: "crop-type-id",
        isPublished: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
        quantityAvailable: 100,
        images: [],
      };

      // appel de l'action serveur
      const result = await createAnnouncementAction(input);

      // vérification du résultat
      expect(result).toEqual({
        data: {
          success: true,
          announcementId: "new-announcement-id",
        },
      });
    });

    it("lance une erreur si l'utilisateur n'est pas un agriculteur", async () => {
      // mock pour simuler un utilisateur qui n'est pas agriculteur
      const authHelperMock = await import("@/lib/auth/helper");
      vi.mocked(authHelperMock.isFarmer).mockRejectedValue(
        new Error("Non agriculteur"),
      );

      // mock du retour de l'action pour lancer une erreur
      // @ts-ignore
      vi.mocked(createAnnouncementAction).mockRejectedValue(
        new Error("Vous n'avez pas les droits pour créer une annonce"),
      );

      // input de test
      const input = {
        title: "Récolte de tomates",
        description: "Venez récolter nos tomates bio",
        fieldId: "field-id",
        cropTypeId: "crop-type-id",
        isPublished: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 86400000),
        quantityAvailable: 100,
        images: [],
      };

      // vérification que l'action lance une erreur
      await expect(createAnnouncementAction(input)).rejects.toThrow(
        "Vous n'avez pas les droits pour créer une annonce",
      );
    });
  });

  describe("deleteAnnouncementAction", () => {
    it("supprime une annonce qui appartient à l'agriculteur", async () => {
      // mock pour la relation
      const gleaningData = {
        id: "gleaning-id",
      };

      // @ts-ignore
      mockPrisma.announcement.findUnique.mockImplementation(({ include }) => {
        // verifier si include.gleaning est demandé
        if (include && include.gleaning) {
          return Promise.resolve({
            id: "announcement-id",
            title: "récolte de tomates",
            ownerId: "farmer-id",
            gleaning: gleaningData,
            createdAt: new Date(),
            updatedAt: new Date(),
            fieldId: "field-id",
            cropTypeId: "crop-type-id",
            slug: "recolte-de-tomates",
            description: "description",
            images: [],
            isPublished: true,
          });
        }
        return Promise.resolve({
          id: "announcement-id",
          title: "récolte de tomates",
          ownerId: "farmer-id",
          createdAt: new Date(),
          updatedAt: new Date(),
          fieldId: "field-id",
          cropTypeId: "crop-type-id",
          slug: "recolte-de-tomates",
          description: "description",
          images: [],
          isPublished: true,
        });
      });

      // mock des suppressions
      // @ts-ignore
      mockPrisma.participation.deleteMany.mockResolvedValue({
        count: 2,
      });
      // @ts-ignore
      mockPrisma.review.deleteMany.mockResolvedValue({ count: 1 });
      // @ts-ignore
      mockPrisma.gleaning.delete.mockResolvedValue({
        id: "gleaning-id",
        announcementId: "announcement-id",
      });
      // @ts-ignore
      mockPrisma.favorite.deleteMany.mockResolvedValue({ count: 3 });
      // @ts-ignore
      mockPrisma.like.deleteMany.mockResolvedValue({ count: 5 });
      // @ts-ignore
      mockPrisma.announcement.delete.mockResolvedValue({
        id: "announcement-id",
      });

      // mock du retour de l'action
      // @ts-ignore
      vi.mocked(deleteAnnouncementAction).mockResolvedValue({
        data: {
          success: true,
          deleted: true,
        },
      });

      // input de test
      const input = {
        announcementId: "announcement-id",
      };

      // appel de l'action serveur
      const result = await deleteAnnouncementAction(input);

      // vérification du résultat
      expect(result).toEqual({
        data: {
          success: true,
          deleted: true,
        },
      });
    });

    it("lance une erreur si l'annonce n'appartient pas à l'agriculteur", async () => {
      // mock pour l'utilisateur agriculteur

      // Simuler le retour via findUnique
      // @ts-ignore
      mockPrisma.announcement.findUnique.mockResolvedValue({
        id: "announcement-id",
        title: "récolte de tomates",
        ownerId: "another-farmer-id",
        createdAt: new Date(),
        updatedAt: new Date(),
        fieldId: "field-id",
        cropTypeId: "crop-type-id",
        slug: "recolte-de-tomates",
        description: "description",
        images: [],
        isPublished: true,
      });

      // mock du retour de l'action pour lancer une erreur
      // @ts-ignore
      vi.mocked(deleteAnnouncementAction).mockRejectedValue(
        new Error("Vous n'êtes pas autorisé à supprimer cette annonce"),
      );

      // input de test
      const input = {
        announcementId: "announcement-id",
      };

      // vérification que l'action lance une erreur
      await expect(deleteAnnouncementAction(input)).rejects.toThrow(
        "Vous n'êtes pas autorisé à supprimer cette annonce",
      );
    });
  });
});
