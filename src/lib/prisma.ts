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
  const specialMethods = {
    $connect: () => Promise.resolve(),
    $disconnect: () => Promise.resolve(),
    $on: () => Promise.resolve(),
    $transaction: (args: any) => {
      if (typeof args === "function") {
        return Promise.resolve(args(getMockPrismaClient()));
      }
      return Promise.resolve([]);
    },
    $use: async (params: any, next: any) => {
      const before = Date.now();
      const result = await next(params);
      const after = Date.now();

      console.log(
        `Query ${params.model}.${params.action} took ${after - before}ms`,
      );
      console.log("Query args:", JSON.stringify(params.args, null, 2));

      return result;
    },
    $extends: () => getMockPrismaClient(),
    $queryRaw: () => Promise.resolve([]),
    $executeRaw: () => Promise.resolve({ count: 0 }),
    $queryRawUnsafe: () => Promise.resolve([]),
    $executeRawUnsafe: () => Promise.resolve({ count: 0 }),
  };

  const mock = {} as PrismaClient;

  const handler = {
    get: (target: any, prop: string) => {
      if (prop in specialMethods) {
        return specialMethods[prop as keyof typeof specialMethods];
      }

      return createModelProxy();
    },
  };

  function createModelProxy() {
    return new Proxy(
      {},
      {
        get: (target, method) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          return (...args: any[]) => {
            switch (method) {
              case "count":
                return Promise.resolve(0);
              case "findUnique":
              case "findFirst":
                return Promise.resolve(null);
              case "findMany":
                return Promise.resolve([]);
              case "create":
              case "update":
              case "upsert":
              case "delete":
                return Promise.resolve({});
              case "createMany":
              case "updateMany":
              case "deleteMany":
                return Promise.resolve({ count: 0 });
              default:
                return Promise.resolve(null);
            }
          };
        },
      },
    );
  }

  return new Proxy(mock, handler);
}

export const prisma = new Proxy({} as PrismaClient, {
  get: (_target, prop) => {
    const client = getPrismaClient();
    return client[prop as keyof PrismaClient];
  },
});
