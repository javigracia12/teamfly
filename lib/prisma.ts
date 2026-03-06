import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createLocalPrisma() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

/** Get D1 binding on Cloudflare Pages (next-on-pages). */
function getD1Binding(): D1Database | null {
  try {
    // next-on-pages: getRequestContext() in edge runtime (server components / route handlers)
    const { getRequestContext } = require("@cloudflare/next-on-pages");
    const ctx = getRequestContext();
    const db = ctx?.env?.DB ?? (process.env as { DB?: D1Database }).DB;
    return db ?? null;
  } catch {
    // Production Pages sometimes injects binding as env
    return (process.env as unknown as { DB?: D1Database }).DB ?? null;
  }
}

/** Use in server components and server actions. On Cloudflare Pages uses D1; locally uses SQLite file. */
export async function getPrisma(): Promise<PrismaClient> {
  const db = getD1Binding();
  if (db) {
    const adapter = new PrismaD1(db);
    return new PrismaClient({ adapter });
  }
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createLocalPrisma();
  }
  return globalForPrisma.prisma;
}

export const prisma =
  globalForPrisma.prisma ?? createLocalPrisma();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
