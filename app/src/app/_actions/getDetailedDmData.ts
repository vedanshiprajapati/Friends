"use server";

import { auth } from "@/auth";
import { db } from "@/app/lib/db";

export const getDm = async () => {
  const session = await auth();
  const userId = session?.user.id;

  const conversations = await db.conversation.findMany({
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
          isRead: true,
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
      participants: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },
    },
  });

  const detailedDMs = conversations.map((conversation) => ({
    id: conversation.id,
    participants: conversation.participants.filter(
      (user) => user.id !== userId
    ),
    lastMessage: conversation.messages[0] || null,
  }));
};
