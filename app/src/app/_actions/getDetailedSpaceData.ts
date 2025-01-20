"use server";

import { db } from "@/app/lib/db";
import { auth } from "@/auth";

export const getDetailedSpaceData = async () => {
  const session = await auth();
  const userId = session?.user.id;
  const spaces = await db.space.findMany({
    where: {
      members: {
        some: { userId },
      },
    },
    include: {
      members: {
        select: {
          id: true,
          role: true,
          user: {
            select: {
              id: true,
              image: true,
              name: true,
              username: true,
              isPrivate: true,
            },
          },
        },
      },
      messages: {
        take: 1, // Get the most recent message
        orderBy: { createdAt: "desc" },
        select: {
          content: true,
          createdAt: true,
          image: true,
          sender: {
            select: {
              id: true,
              role: true,
              user: {
                select: {
                  id: true,
                  image: true,
                  name: true,
                  username: true,
                  isPrivate: true,
                },
              },
            },
          },
        },
      },
    },
  });
  console.log(spaces);
  return spaces;
};
