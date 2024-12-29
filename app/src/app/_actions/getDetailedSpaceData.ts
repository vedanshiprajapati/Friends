"use server";

import { db } from "@/app/lib/db";
import { auth } from "@/auth";

export const getSpace = async () => {
  const session = await auth();
  const userId = session?.user.id;
  const spaces = await db.space.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: {
      messages: {
        take: 1, // Get the most recent message
        orderBy: { createdAt: "desc" },
        select: {
          content: true,
          createdAt: true,
          sender: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
            },
          },
        },
      },
    },
  });

  const detailedSpaces = spaces.map((space) => ({
    id: space.id,
    name: space.name,
    lastMessage: space.messages[0] || null,
  }));

  return detailedSpaces;
};
