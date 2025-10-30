import { PrismaClient } from "@prisma/client";
import { ENV } from "./env";

let prisma: PrismaClient;

if (!prisma) {
  prisma = new PrismaClient({
    datasources: { db: { url: ENV.DATABASE_URL } },
  });
}

export { prisma };
