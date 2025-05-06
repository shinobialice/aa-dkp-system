import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      active: boolean;
      username: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: number;
    active: boolean;
    username: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    active: boolean;
    username: string;
  }
}
