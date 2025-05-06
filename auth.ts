import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import VkProvider from "next-auth/providers/vk";
import MailRuProvider from "next-auth/providers/mailru";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
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
      clientId: process.env.MAILRU_CLIENT_ID,
      clientSecret: process.env.MAILRU_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.active = user.active;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.active = token.active;
      }
      return session;
    },
    async signIn({ account, profile }) {
      if (account?.provider === "google") {
        const cookieStore = await cookies();
        const token = cookieStore.get("link-token")?.value;

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
              data: { googleId: account.providerAccountId },
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
            googleId: account.providerAccountId,
            active: true,
          },
        });

        return !!existingUser;
      }

      return false;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
});
