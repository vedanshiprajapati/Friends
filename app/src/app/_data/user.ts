import { db } from "@/app/lib/db";
import { auth } from "@/auth";

export const getUserByEmail = async (email: string) => {
  try {
    console.log(email);
    const user = await db.user.findUnique({ where: { email } });
    return user;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({ where: { id } });
    return user;
  } catch {
    return { error: "Can't find the user" };
  }
};
