import { PrismaClient } from "@prisma/client";
import { neonConfig } from "@neondatabase/serverless";

// Configure Neon to use fetch for queries
neonConfig.poolQueryViaFetch = true;
declare global {
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = db;
