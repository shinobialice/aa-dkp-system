import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Vk from "next-auth/providers/Vk";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google, Vk],
});
