"use server";

import { auth } from "@/auth";
import { db } from "@/app/lib/db";

export const getDetailedDmData = async () => {
  const session = await auth();
  const userId = session?.user.id;

  const conversations = await db.conversation.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    where: {
      participants: {
        some: { id: userId },
      },
    },
    include: {
      messages: {
        take: 1, // Get the most recent message
        orderBy: { createdAt: "desc" },
        select: {
          content: true,
          createdAt: true,
          isReadList: true,
          image: true,
          sender: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              isPrivate: true,
            },
          },
        },
      },
      participants: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          isPrivate: true,
        },
      },
    },
  });

  const detailedDMs = conversations.map((conversation) => ({
    id: conversation.id,
    createdAt: conversation.createdAt,
    updatedAt: conversation.updatedAt,
    participants: conversation.participants.filter(
      (user) => user.id !== userId
    ),
    lastMessage: conversation.messages[0] || null,
  }));

  return detailedDMs;
};
