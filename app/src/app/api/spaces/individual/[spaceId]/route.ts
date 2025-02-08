import { db } from "@/app/lib/db";
import { auth } from "@/auth";

import { NextResponse } from "next/server";

const MESSAGES_PER_PAGE = 20;
interface Iparams {
  spaceId: string;
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
  const { spaceId } = await context.params;
  const cursor = new URL(req.url).searchParams.get("cursor");

  try {
    // Fetch messages with pagination
    const messages = await db.spaceMessage.findMany({
      where: { spaceId },
      take: MESSAGES_PER_PAGE,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
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
    });

    // Get space members for resolving readBy
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
      },
    });

    if (!space) {
      return NextResponse.json(
        { message: "Space not found", status: "error" },
        { status: 404 }
      );
    }

    // Resolve readBy users for each message
    const messagesWithReadBy = messages.map((message) => ({
      ...message,
      readBy: message.isReadList
        .map((userId) =>
          space.members.find((member) => member.user.id === userId)
        )
        .filter(Boolean),
    }));

    const nextCursor =
      messages.length === MESSAGES_PER_PAGE
        ? messages[messages.length - 1].id
        : null;

    return NextResponse.json({
      status: "success",
      message: "Messages retrieved successfully",
      data: {
        messages: messagesWithReadBy,
        nextCursor,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch messages",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
