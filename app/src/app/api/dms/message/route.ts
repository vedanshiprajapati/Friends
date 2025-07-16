import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { pusherServer } from "@/app/lib/pusher";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, image, conversationId } = body;

    if (!content && !image) {
      return NextResponse.json(
        { error: "Content or image is required." },
        { status: 400 }
      );
    }

    if (!conversationId) {
      return NextResponse.json(
        { error: "Conversation ID is required." },
        { status: 400 }
      );
    }

    const token = await auth();
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized!", status: "error" },
        { status: 401 }
      );
    }

    const userId = token.user.id;

    const [conversation, newMessage] = await Promise.all([
      db.conversation.findUnique({
        where: { id: conversationId },
        include: { participants: true },
      }),
      db.directMessage.create({
        data: {
          content,
          image,
          conversation: { connect: { id: conversationId } },
          sender: { connect: { id: userId } },
          receiver: { connect: { id: userId } },
          isReadList: [userId!],
        },
      }),
    ]);

    const receiverId = conversation?.participants.find(
      (p) => p.id !== userId
    )?.id;

    if (!receiverId) {
      return NextResponse.json(
        { error: "Receiver not found" },
        { status: 404 }
      );
    }

    await Promise.all([
      db.directMessage.update({
        where: { id: newMessage.id },
        data: { receiver: { connect: { id: receiverId } } },
      }),
      pusherServer.trigger(conversationId, "messages:new", { newMessage }),
    ]);

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
