import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { db } from "@/app/lib/db";
import { pusherServer } from "@/app/lib/pusher";

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { content, image, conversationId } = body;
    // Validate required fields
    console.log("in message postt");
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

    // Authenticate the user
    const token = await getToken({ req: req, secret: process.env.AUTH_SECRET });
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized!", status: "error" },
        { status: 401 }
      );
    }

    const userId = token.sub;

    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: { participants: true },
    });
    console.log(conversation, "CONVERSATIONNNNNN");
    const receiverId = conversation?.participants.find(
      (p) => p.id !== userId
    )?.id;
    if (!receiverId) {
      return NextResponse.json(
        { error: "Receiver not found" },
        { status: 404 }
      );
    }

    // Save the message to the database
    const newMessage = await db.directMessage.create({
      data: {
        content,
        image,
        conversation: {
          connect: { id: conversationId },
        },
        sender: {
          connect: { id: userId },
        },
        receiver: {
          connect: { id: receiverId },
        },
        isReadList: [userId!],
      },
    });
    console.log(newMessage, "MESSAGE NEWWW");
    await pusherServer.trigger(conversationId, "messages:new", {
      newMessage,
    });

    // Return success response
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
}
