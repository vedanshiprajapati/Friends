"use server";
import { auth } from "@/auth";
import { db } from "@/app/lib/db";

export const getBasicSpaceData = async () => {
  const session = await auth();
  const userId = session?.user.id;

  const spaces = await db.space.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    select: {
      id: true,
      name: true,
      isPrivate: true,
      image: true,
    },
  });
  return spaces;
};
