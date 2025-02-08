import { db } from "@/app/lib/db";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
interface Iparams {
  id: string;
}
export async function GET(req: Request, context: { params: Promise<Iparams> }) {
  const token = await auth();
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized!", status: "error" },
      { status: 401 }
    );
  }

  const currentUserId = token.user.id;
  const { id } = await context.params;
  const conversationId = id;

  if (!conversationId) {
    return NextResponse.json(
      { message: "Missing 'id' parameter", status: "error" },
      { status: 400 }
    );
  }

  const cursor = new URL(req.url).searchParams.get("cursor");
  const limit = 10;

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
          take: limit,
          skip: cursor ? 1 : 0,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: { createdAt: "desc" },
          include: {
            sender: {
              select: {
                name: true,
                username: true,
                image: true,
                id: true,
                isPrivate: true,
              },
            },
            receiver: {
              select: {
                name: true,
                username: true,
                image: true,
                id: true,
                isPrivate: true,
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

    const isParticipant = conversation.participants.some(
      (participant) => participant.id === currentUserId
    );
    if (!isParticipant) {
      return NextResponse.json(
        { message: "Access denied", status: "error" },
        { status: 403 }
      );
    }

    const otherUser = conversation.participants.find(
      (participant) => participant.id !== currentUserId
    );

    const nextCursor =
      conversation.messages.length === limit
        ? conversation.messages[limit - 1].id
        : null;

    return NextResponse.json(
      {
        status: "success",
        message: "DM conversation retrieved successfully",
        data: {
          messages: conversation.messages,
          nextCursor,
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
