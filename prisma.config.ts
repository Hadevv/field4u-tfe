import { PrismaConfig } from "prisma/config";
import path from "node:path";
import { config } from "dotenv";

config({ path: ".env.local" });
config({ path: ".env" });

export default {
  earlyAccess: true,
  schema: path.join("prisma", "schema"),
} satisfies PrismaConfig;
