"use server";
import { auth } from "@/auth";
import { db } from "@/app/lib/db";

export const getBasicDmdata = async () => {
  const session = await auth();
  const userId = session?.user.id;

  const conversations = await db.conversation.findMany({
    where: {
      participants: {
        some: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
      participants: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
          isPrivate: true,
        },
      },
      messages: {
        take: 1, // Fetch the latest message
        orderBy: {
          createdAt: "desc",
        },
        select: {
          content: true,
          createdAt: true,
        },
      },
    },
  });

  const minimalDMs = conversations.map((conversation) => {
    // Determine the other user in the conversation
    const otherUser = conversation.participants.find(
      (participant) => participant.id !== userId
    );

    return {
      id: conversation.id,
      user: otherUser,
      // latestMessage: conversation.messages[0] || null,
    };
  });

  return minimalDMs;
};
