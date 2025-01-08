"use server";

import { auth } from "@/auth";
import { db } from "@/app/lib/db";
import { SpaceMessage } from "@prisma/client";

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
                isPrivate: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: "asc" }, // Messages in chronological order
          include: {
            sender: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                    name: true,
                    image: true,
                    isPrivate: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!space) {
      throw new Error("Space not found.");
    }

    const resolveReadByUsers = (message: SpaceMessage, members: any) => {
      return message.isReadList.map((userId: string) => {
        const member = members.find((m: any) => m.user.id === userId);
        return member ? member : null;
      });
    };

    // Add resolved "readBy" data to each message
    const messagesWithReadBy = space.messages.map((message) => ({
      ...message,
      readBy: resolveReadByUsers(message, space.members),
    }));

    const spaceWithReadBy = { ...space, messages: messagesWithReadBy };

    return spaceWithReadBy;
  } catch (error: any) {
    throw new Error(`Failed to fetch space: ${error.message}`);
  }
};
