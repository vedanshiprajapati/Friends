import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { pusherServer } from "@/app/lib/pusher";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const startTime = Date.now();

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

    // ✅ Fetch only the receiver ID instead of the whole conversation
    const receiverId = await db.conversation
      .findUnique({
        where: { id: conversationId },
        select: {
          participants: {
            select: { id: true },
          },
        },
      })
      .then(
        (conversation) =>
          conversation?.participants.find((p) => p.id !== userId)?.id
      );

    if (!receiverId) {
      return NextResponse.json(
        { error: "Receiver not found" },
        { status: 404 }
      );
    }

    // ✅ Create the message with the correct sender & receiver in a single step
    const newMessage = await db.directMessage.create({
      data: {
        content,
        image,
        conversation: { connect: { id: conversationId } },
        sender: { connect: { id: userId } },
        receiver: { connect: { id: receiverId } },
        isReadList: [userId!],
      },
    });

    const pusherStart = Date.now();
    await pusherServer.trigger(conversationId, "messages:new", { newMessage });
    console.log("Pusher Execution Time:", Date.now() - pusherStart, "ms");

    console.log("API Execution Time:", Date.now() - startTime, "ms");
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
