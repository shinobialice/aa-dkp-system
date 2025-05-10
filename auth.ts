import { cookies } from "next/headers";
import type { NextAuthOptions, Account, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import supabase from "./lib/supabase";
import { OAuthConfig } from "next-auth/providers/oauth";

const VKProvider = (): OAuthConfig<any> => ({
  id: "vk",
  name: "VK",
  type: "oauth",
  authorization: {
    url: "https://id.vk.com/auth",
    params: {
      scope: "openid",
      response_type: "code",
    },
  },
  token: {
    url: "https://api.vk.com/oauth/token",
  },
  userinfo: {
    url: "https://api.vk.com/openid/userinfo",
  },
  clientId: process.env.VK_CLIENT_ID!,
  clientSecret: process.env.VK_CLIENT_SECRET!,
  checks: ["pkce", "state"],
  profile: (profile) => {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      image: profile.picture,
      active: true,
      username: profile.username,
    };
  },
});

const authConfig: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    VKProvider(),
  ],
  callbacks: {
    async signIn({ account }: { account: Account | null }) {
      if (!account?.provider || !account.providerAccountId) {
        return false;
      }

      const cookieStore = await cookies();
      const token = cookieStore.get("link-token")?.value;
      const providerId = account.provider;
      const providerAccountId = account.providerAccountId;

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
                providerId === "google" ? providerAccountId : undefined,
              vk_id: providerId === "vk" ? providerAccountId : undefined,
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
            providerId === "google" ? `google_id.eq.${providerAccountId}` : "",
            providerId === "vk" ? `vk_id.eq.${providerAccountId}` : "",
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
                ? `vk_id.eq.${account.providerAccountId}`
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
