import NextAuth, { type DefaultSession } from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/app/lib/db";
import { getUserById } from "@/app/_data/user";

declare module "next-auth" {
  interface User {
    username?: string;
  }

  interface Session {
    user: {
      username?: string;
      image?: string;
    } & DefaultSession["user"];
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (!token.user.id) return token;

      const existingUser = await getUserById(token.user.id);
      if (!existingUser || "error" in existingUser) return token;

      token.username = existingUser.username;

      if (trigger === "update") {
        return {
          ...token,
          name: session.user.name ?? token.name,
          picture: session.user.image ?? token.picture,
          username: session.user.username ?? token.username,
        };
      }

      if (user) {
        return {
          ...token,
          name: user.name,
          picture: user.image,
          username: user.username,
        };
      }

      return token;
    },
    async session({ session, token, trigger }) {
      if (token.user.id && session.user) {
        session.user.id = token.user.id;
      }
      if (token.role && session.user && typeof token.username === "string") {
        session.user.username = token.username;
      }
      if (trigger === "update" && token.picture) {
        session.user.image = token.picture;
      }
      return session;
    },
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
    async signIn(message) {
      console.log("USER IS LOGGING IN", message);
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
