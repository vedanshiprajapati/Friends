import { db } from "@/app/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({ where: { email } });
    console.log(user, "user mila in getuserbymail function");
    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({ where: { id } });
    console.log(user, "user mila in getuserbyid function");
    return user;
  } catch {
    return { error: "Can't find the user" };
  }
};
