import { db } from "@/app/lib/db";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
interface Iparams {
  id: string;
}
export async function POST(
  req: Request,
  context: { params: Promise<Iparams> }
) {
  const token = await getToken({ req: req, secret: process.env.AUTH_SECRET });

  // Check if the user is authenticated
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized!", status: "error" },
      { status: 401 }
    );
  }

  const currentUserId = token.sub;
  const { id: conversationId } = await context.params;

  try {
    // Check if the conversation exists
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true }, // Include participants to verify membership
    });

    if (!conversation) {
      return NextResponse.json(
        { message: "Conversation not found!", status: "error" },
        { status: 404 }
      );
    }

    // Check if the user is a participant in the conversation
    const isParticipant = conversation.participants.some(
      (participant) => participant.id === currentUserId
    );

    if (!isParticipant) {
      return NextResponse.json(
        { message: "You are not part of this conversation!", status: "error" },
        { status: 403 }
      );
    }

    // Fetch all unread messages in the conversation that the current user hasn't read yet
    const unreadMessages = await db.directMessage.findMany({
      where: {
        conversationId,
        receiverId: currentUserId, // Only messages sent to the current user
        NOT: {
          isReadList: {
            has: currentUserId, // Exclude messages already read by the current user
          },
        },
      },
    });

    // Update each unread message to add the current user's ID to the isReadList array
    for (const message of unreadMessages) {
      await db.directMessage.update({
        where: { id: message.id },
        data: {
          isReadList: {
            push: currentUserId, // Add the current user's ID to the isReadList array
          },
        },
      });
    }

    return NextResponse.json(
      {
        message: "Messages in the conversation marked as read successfully!",
        status: "success",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error marking messages as read:", error);
    return NextResponse.json(
      {
        message: "Internal server error!",
        status: "error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
