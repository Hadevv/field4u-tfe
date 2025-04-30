import "@testing-library/jest-dom";
import { beforeAll, vi, afterAll } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import { PrismaClient } from "@prisma/client";

// mock de prisma pour les tests
export const mockPrisma = mockDeep<PrismaClient>();

// mock des modules nextjs
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
    getAll: vi.fn(),
  }),
  usePathname: () => "/test-path",
  redirect: vi.fn(),
  notFound: vi.fn(),
}));

// mock de prisma
vi.mock("@/lib/prisma", () => ({
  prisma: mockPrisma,
}));

// mock de nextauth
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(() => ({
    data: {
      user: {
        id: "test-user-id",
        name: "test user",
        email: "test@example.com",
      },
    },
    status: "authenticated",
  })),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

// reset les mocks avant chaque test
beforeAll(() => {
  vi.resetModules();
  mockReset(mockPrisma);
});

// nettoyage après les tests
afterAll(() => {
  vi.clearAllMocks();
});
