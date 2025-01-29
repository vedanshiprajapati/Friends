"use server";

import * as z from "zod";
import { StrictLoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/app/_data/user";

export const signin = async (
  values: z.infer<typeof StrictLoginSchema>,
  callbackUrl?: string | null
) => {
  console.log("custom signin function me");

  const validatedFields = StrictLoginSchema.safeParse(values);
  if (!validatedFields.success) {
    // return { message: "Invalidated fields", status: "error" };
    throw new Error("Invalid Credentials");
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email) {
    return {
      message:
        "Email does not exist! Please try signing in with Google Provider or sign up!",
      status: "error",
    };
    // throw new Error("User does not exist, Please sign up!");
  }
  if (!existingUser.password) {
    // throw new Error("Sign in failed! Try again with Google");
    return {
      message: "Sign in failed! Try again with Google",
      status: "error",
    };
  }

  try {
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
          // throw new Error("Invalid Credentials!");
        }
        default:
          return {
            message: "something went wrong while signin in!",
            error: error,
            status: "error",
          };
        // throw new Error("something went wrong while signin in!");
      }
    }
    throw error;
  }
};
