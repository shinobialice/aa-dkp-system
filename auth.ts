import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import VkProvider from "next-auth/providers/vk";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    VkProvider({
      clientId: process.env.VK_CLIENT_ID,
      clientSecret: process.env.VK_CLIENT_SECRET
    })
  ],
});

export const authMiddleware = auth;
