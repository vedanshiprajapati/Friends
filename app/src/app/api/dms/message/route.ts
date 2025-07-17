import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { pusherServer } from "@/app/lib/pusher";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { content, image, conversationId } = body;

    // Validate required fields
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
    const token = await auth();
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized!", status: "error" },
        { status: 401 }
      );
    }

    const userId = token.user.id;

    // Get conversation and find receiver in one query
    const conversation = await db.conversation.findUnique({
      where: { id: conversationId },
      include: {
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

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found." },
        { status: 404 }
      );
    }

    // Check if user is a participant
    const isParticipant = conversation.participants.some(
      (p) => p.id === userId
    );
    if (!isParticipant) {
      return NextResponse.json(
        { error: "User is not a participant in this conversation." },
        { status: 403 }
      );
    }

    // Find receiver (the other participant)
    const receiver = conversation.participants.find((p) => p.id !== userId);
    if (!receiver) {
      return NextResponse.json(
        { error: "Receiver not found." },
        { status: 404 }
      );
    }

    // Create message with correct sender and receiver in one operation
    const newMessage = await db.directMessage.create({
      data: {
        content,
        image,
        conversation: { connect: { id: conversationId } },
        sender: { connect: { id: userId } },
        receiver: { connect: { id: receiver.id } },
        isReadList: [userId!],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
      },
    });

    // Trigger Pusher event for real-time updates
    await pusherServer.trigger(conversationId, "messages:new", {
      newMessage,
      conversationId,
    });

    // Return success response with included data
    return NextResponse.json(
      {
        status: "success",
        data: newMessage,
        message: "Message sent successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving message:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error.",
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
