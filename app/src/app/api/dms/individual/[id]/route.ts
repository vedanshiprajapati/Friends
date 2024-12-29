import { db } from "@/app/lib/db";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req: Request, context: { params: { id: string } }) {
  const token = await getToken({ req: req, secret: process.env.AUTH_SECRET });
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized!", status: "error" },
      { status: 401 }
    );
  }

  const currentUserId = token?.sub;
  const { id } = context.params;
  const conversationId = id; // Extract "id" (conversation ID) from query params

  if (!conversationId) {
    return NextResponse.json(
      { message: "Missing 'id' parameter", status: "error" },
      { status: 400 }
    );
  }

  try {
    // Fetch the conversation by ID
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
      return NextResponse.json(
        { message: "Conversation not found", status: "error" },
        { status: 404 }
      );
    }

    // Ensure the current user is a participant in the conversation
    const isParticipant = conversation.participants.some(
      (participant) => participant.id === currentUserId
    );
    if (!isParticipant) {
      return NextResponse.json(
        { message: "Access denied", status: "error" },
        { status: 403 }
      );
    }

    // Identify the other user in the conversation
    const otherUser = conversation.participants.find(
      (participant) => participant.id !== currentUserId
    );

    return NextResponse.json(
      {
        status: "success",
        message: "DM conversation retrieved successfully",
        data: {
          otherUser,
          messages: conversation.messages,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch DM conversation",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
