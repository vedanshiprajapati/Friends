import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas";

import Google from "next-auth/providers/google";
import { getUserByEmail } from "@/app/_data/user";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async profile(profile) {
        const existingUser = await getUserByEmail(profile.email);
        console.log(existingUser, "get user by idd");
        // If user exists but only with credentials, throw an error
        // !existingUser.accounts.some(acc => acc.provider === 'google')
        if (existingUser && existingUser.password) {
          throw new Error(
            "Email already registered with credentials. Please use email login."
          );
        }

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
    Credentials({
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const user = await getUserByEmail(email);
        if (!user || !user.password) throw new Error("use OAuth Account");

        if (password !== user.password) {
          throw new Error("Invalid password");
        }
        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
