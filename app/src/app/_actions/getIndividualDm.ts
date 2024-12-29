"use server";

import { auth } from "@/auth";
import { db } from "@/app/lib/db";

export const getIndividualDm = async (conversationId: string) => {
  const session = await auth();
  const currentUserId = session?.user.id;

  if (!currentUserId) {
    throw new Error("Unauthorized: User is not logged in.");
  }

  try {
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
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
          orderBy: { createdAt: "asc" },
          include: {
            sender: {
              select: {
                name: true,
                username: true,
              },
            },
            receiver: {
              select: {
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!conversation) {
      throw new Error("Conversation not found!");
    }

    const isParticipant = conversation.participants.some(
      (participant) => participant.id === currentUserId
    );

    if (!isParticipant) {
      throw new Error("Access denied");
    }

    // Identify the other user in the conversation
    const otherUser = conversation.participants.find(
      (participant) => participant.id !== currentUserId
    );

    return {
      otherUser,
      messages: conversation.messages,
    };
  } catch (error: any) {
    throw new Error(`Failed to fetch DM conversation: ${error.message}`);
  }
};
