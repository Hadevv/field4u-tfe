/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";

let prismaGlobal: PrismaClient | undefined;

export function getPrismaClient() {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return getMockPrismaClient();
  }

  if (!prismaGlobal) {
    prismaGlobal = new PrismaClient();
  }

  return prismaGlobal;
}

function getMockPrismaClient() {
  const mock = {} as PrismaClient;
  const handler = {
    get: (target: any, prop: string) => {
      if (
        [
          "$connect",
          "$disconnect",
          "$on",
          "$transaction",
          "$use",
          "$extends",
        ].includes(prop)
      ) {
        return () => Promise.resolve(undefined);
      }

      return new Proxy(
        {},
        {
          get: () => {
            return new Proxy(() => {}, {
              get: () => {
                return new Proxy(() => {}, {
                  get: () => () => Promise.resolve([]),
                  apply: () => Promise.resolve([]),
                });
              },
              apply: () => Promise.resolve([]),
            });
          },
          apply: () => Promise.resolve([]),
        },
      );
    },
  };

  return new Proxy(mock, handler);
}

export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    return getPrismaClient()[prop as keyof PrismaClient];
  },
});
