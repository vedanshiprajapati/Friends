import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./schemas";
import { getUserByEmail } from "@/_data/user";
import Google from "next-auth/providers/google";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      async profile(profile) {
        const existingUser = await getUserByEmail(profile.email);

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
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        console.log("in authorize function");
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await getUserByEmail(email);
          if (!user || !user.password) throw new Error("use OAuth Account");

          if (password === user.password) {
            return user;
          } else {
            throw new Error("Invalid Password!");
          }
        }
        throw new Error("Invalid Credentials");
      },
    }),
  ],
} satisfies NextAuthConfig;
