import NextAuth, { type DefaultSession } from "next-auth";
import authConfig from "@/auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/app/lib/db";
import { getUserById } from "@/app/_data/user";

// Add this type declaration at the top
declare module "next-auth" {
  interface User {
    username?: string;
  }

  interface Session {
    user: {
      username?: string;
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
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser || "error" in existingUser) return token;

      token.username = existingUser.username;

      if (trigger === "update") {
        // Update token with new session data
        token.name = session.user.name;
        token.username = session.user.username;
        token.image = session.user.image;
      }

      // If user object exists (during initial login), populate token
      if (user) {
        token.name = user.name;
        token.username = user.username;
        token.image = user.image;
      }

      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user && typeof token.username === "string") {
        session.user.username = token.username;
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
      // You can add additional logging or actions here
      console.log("USER IS LOGGING IN ____________", message);
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  // providers: [
  //   GitHub({
  //     clientId: process.env.GITHUB_ID!,
  //     clientSecret: process.env.GITHUB_SECRET!,
  //   }),
  //   Google({
  //     clientId: process.env.GOOGLE_ID!,
  //     clientSecret: process.env.GOOGLE_SECRET!,
  //   }),
  // ],
});
