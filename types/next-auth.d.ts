import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: number;
    active: boolean;
  }

  interface Session {
    user: {
      id: number;
      active: boolean;
    } & DefaultSession["user"];
  }

  interface JWT {
    id: number;
    active: boolean;
  }
}
