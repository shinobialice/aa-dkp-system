import { cookies } from "next/headers";
import type { NextAuthOptions, Account, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import VK from "next-auth/providers/vk";
import supabase from "./lib/supabase";

const apiVersion = "5.199"; // https://vk.com/dev/versions

const authConfig: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    {
      ...VK({
        checks: [],
        clientId: process.env.VK_CLIENT_ID!,
        clientSecret: process.env.VK_CLIENT_SECRET!,
      }), // Fix: PKCE is unsupported for server-side authorization
      authorization: `https://oauth.vk.com/authorize?scope=email&v=${apiVersion}`,
      userinfo: `https://api.vk.com/method/users.get?fields=photo_100&v=${apiVersion}`,
      token: {
        url: `https://oauth.vk.com/access_token?v=${apiVersion}`,
        conform: async (response) => {
          const data = await response.json();
          return new Response(
            // Fix: OperationProcessingError: "response" body "token_type" property must be a string
            JSON.stringify({
              token_type: "dpop",
              ...data,
            }),
            // Fix: OperationProcessingError: "response" content-type must be application/json
            {
              headers: { "content-type": "application/json" },
              status: response.status,
            }
          );
        },
      } as unknown,
    },
  ],
  callbacks: {
    async signIn({ account }: { account: Account | null }) {
      if (!account?.provider || !account.providerAccountId) {
        return false;
      }

      const cookieStore = await cookies();
      const token = cookieStore.get("link-token")?.value;

      if (token) {
        const { data: linkToken } = await supabase
          .from("link_token")
          .select("*, user(*)")
          .eq("token", token)
          .eq("used", false)
          .gt("expiresAt", new Date().toISOString())
          .maybeSingle();

        if (linkToken) {
          await supabase
            .from("user")
            .update({
              google_id:
                account.provider === "google"
                  ? account.providerAccountId
                  : undefined,
              vk:
                account.provider === "vk"
                  ? account.providerAccountId
                  : undefined,
            })
            .eq("id", linkToken.user_id);

          await supabase
            .from("link_token")
            .update({ used: true })
            .eq("id", linkToken.id);

          return true;
        }

        return false;
      }

      const { data: existingUsers } = await supabase
        .from("user")
        .select("*")
        .eq("active", true)
        .or(
          [
            account.provider === "google"
              ? `google_id.eq.${account.providerAccountId}`
              : "",
            account.provider === "vk"
              ? `vk_id.eq.${account.providerAccountId}`
              : "",
          ]
            .filter(Boolean)
            .join(",")
        );

      return !!existingUsers?.[0];
    },

    async jwt({ token, user, account }) {
      if (user && account?.provider && account.providerAccountId) {
        const { data: dbUsers } = await supabase
          .from("user")
          .select("id, active, username")
          .or(
            [
              account.provider === "google"
                ? `google_id.eq.${account.providerAccountId}`
                : "",
              account.provider === "vk"
                ? `_id.eq.${account.providerAccountId}`
                : "",
            ]
              .filter(Boolean)
              .join(",")
          );

        const dbUser = dbUsers?.[0];
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
