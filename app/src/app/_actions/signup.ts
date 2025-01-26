"use server";

import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/app/_data/user";
import { db } from "@/app/lib/db";

export const signup = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  const image = "/default-image.jpg";
  if (existingUser) {
    return { error: "Email already in use!" };
  }
  try {
    const user = await db.user.create({
      data: {
        email,
        name,
        password,
        image,
      },
    });

    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin": {
          return { error: "Invalid Credentials!", message: error };
        }
        default:
          return {
            message: "something went wrong while Signing up!",
            error: error,
          };
      }
    }
    throw error;
  }
  return { success: "user is created!" };
};
