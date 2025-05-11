// pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import { authOptions } from "@/auth"; // или путь к authOptions

export default NextAuth(authOptions);
