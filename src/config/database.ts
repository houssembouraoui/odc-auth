import { PrismaClient } from "@prisma/client";
import { ENV } from "./env";

const prisma = new PrismaClient({
  datasources: { db: { url: ENV.DATABASE_URL } },
});

export { prisma };
