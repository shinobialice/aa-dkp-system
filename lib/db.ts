import { PrismaClient } from "@/prisma/generated/prisma-client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prismaClientSingleton = () =>
  new PrismaClient().$extends(withAccelerate());

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
