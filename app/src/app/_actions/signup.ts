"use server";

import * as z from "zod";
import { StrictRegisterSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/app/_data/user";
import { db } from "@/app/lib/db";

export const signup = async (values: z.infer<typeof StrictRegisterSchema>) => {
  const validatedFields = StrictRegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name } = validatedFields.data;
  const existingUser = await getUserByEmail(email);
  const image = "/default-image.jpg";
  if (existingUser) {
    return { message: "Email already in use!", status: "error" };
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
          return {
            message: "Invalid Credentials!",
            error: error,
            status: "error",
          };
        }
        default:
          return {
            message: "something went wrong while Signing up!",
            error: error,
            status: "error",
          };
      }
    }
    throw error;
  }
  return { message: "user is created!", status: "success" };
};
