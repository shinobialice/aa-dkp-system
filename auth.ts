import { cookies } from "next/headers";
import type {
  NextAuthOptions,
  Account,
  Session,
  User as NextAuthUser,
} from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import MailRuProvider from "next-auth/providers/mailru";
import VkProvider from "next-auth/providers/vk";
import prisma from "@/lib/db";

const authConfig: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    VkProvider({
      clientId: process.env.VK_CLIENT_ID!,
      clientSecret: process.env.VK_CLIENT_SECRET!,
    }),
    MailRuProvider({
      clientId: process.env.MAILRU_CLIENT_ID!,
      clientSecret: process.env.MAILRU_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account }: { account: Account | null }) {
      if (!account?.provider || !account.providerAccountId) {return false;}

      const cookieStore = cookies();
      const token = (await cookieStore).get("link-token")?.value;

      if (token) {
        const linkToken = await prisma.linkToken.findFirst({
          where: {
            token,
            used: false,
            expiresAt: { gt: new Date() },
          },
          include: { user: true },
        });

        if (linkToken) {
          await prisma.user.update({
            where: { id: linkToken.userId },
            data: {
              googleId:
                account.provider === "google"
                  ? account.providerAccountId
                  : undefined,
              vkId:
                account.provider === "vk"
                  ? account.providerAccountId
                  : undefined,
            },
          });

          await prisma.linkToken.update({
            where: { id: linkToken.id },
            data: { used: true },
          });

          return true;
        }

        return false;
      }

      const existingUser = await prisma.user.findFirst({
        where: {
          active: true,
          OR: [
            {
              googleId:
                account.provider === "google"
                  ? account.providerAccountId
                  : undefined,
            },
            {
              vkId:
                account.provider === "vk"
                  ? account.providerAccountId
                  : undefined,
            },
            {
              vkId:
                account.provider === "mailru"
                  ? account.providerAccountId
                  : undefined,
            },
          ],
        },
      });

      return !!existingUser;
    },

    async jwt({ token, user, account }) {
      if (user) {
        const dbUser = await prisma.user.findFirst({
          where: {
            OR: [
              {
                googleId:
                  account?.provider === "google"
                    ? account.providerAccountId
                    : undefined,
              },
              {
                vkId:
                  account?.provider === "vk"
                    ? account.providerAccountId
                    : undefined,
              },
              {
                vkId:
                  account?.provider === "mailru"
                    ? account.providerAccountId
                    : undefined,
              },
            ],
          },
          select: {
            id: true,
            active: true,
            username: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.active = dbUser.active;
          token.username = dbUser.username;
        }
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.id = token.id;
      session.user.active = token.active;
      session.user.username = token.username;

      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
};

export default authConfig;
