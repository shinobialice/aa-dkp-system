// auth.ts
import type { NextAuthOptions, SessionStrategy } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const VK_CLIENT_ID = process.env.VK_CLIENT_ID!;
const VK_CLIENT_SECRET = process.env.VK_CLIENT_SECRET!;
const VK_REDIRECT_URI = process.env.VK_REDIRECT_URI!;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "vk",
      name: "VK",
      credentials: {
        code: { label: "VK Code", type: "text" },
      },
      async authorize(credentials) {
        const code = credentials?.code;
        if (!code) return null;

        const tokenRes = await axios.get("https://oauth.vk.com/access_token", {
          params: {
            client_id: VK_CLIENT_ID,
            client_secret: VK_CLIENT_SECRET,
            redirect_uri: VK_REDIRECT_URI,
            code,
          },
        });

        const { access_token, user_id } = tokenRes.data;

        const profileRes = await axios.get(
          "https://api.vk.com/method/users.get",
          {
            params: {
              user_ids: user_id,
              access_token,
              v: "5.199",
              fields: "photo_200,screen_name",
            },
          }
        );

        const user = profileRes.data.response?.[0];
        if (!user) return null;

        return {
          id: Number(user.id), // ← гарантируем number
          name: `${user.first_name} ${user.last_name}`,
          email: `${user.id}@vk.com`,
          image: user.photo_200,
          username: user.screen_name || `vk_${user.id}`,
          active: true, // заглушка или логика активности
        };
      },
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id);
        token.username = user.username;
        token.active = user.active;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as number;
      session.user.username = token.username as string;
      session.user.active = token.active as boolean;
      return session;
    },
  },
};
