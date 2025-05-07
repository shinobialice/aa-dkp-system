import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  type Session = {
    user: {
      id: number;
      active: boolean;
      username: string;
    } & DefaultSession["user"];
  }

  type User = {
    id: number;
    active: boolean;
    username: string;
  } & DefaultUser
}

declare module "next-auth/jwt" {
  type JWT = {
    id: number;
    active: boolean;
    username: string;
  }
}
