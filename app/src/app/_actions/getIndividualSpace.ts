"use server";

import { auth } from "@/auth";
import { db } from "@/app/lib/db";

export const getIndividualSpace = async (spaceId: string) => {
  const session = await auth();
  const currentUserId = session?.user.id;

  if (!currentUserId) {
    throw new Error("Unauthorized: User is not logged in.");
  }

  try {
    const space = await db.space.findUnique({
      where: { id: spaceId },
      include: {
        members: {
          select: {
            id: true,
            role: true,
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                image: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "asc" }, // Messages in chronological order
          include: {
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

    if (!space) {
      throw new Error("Group not found.");
    }

    return space;
  } catch (error: any) {
    throw new Error(`Failed to fetch space: ${error.message}`);
  }
};
