import { NextResponse } from "next/server";

import { db } from "@/app/lib/db";
import { pusherServer } from "@/app/lib/pusher";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { content, image, spaceId } = body;

    // Validate required fields
    if (!content && !image) {
      return NextResponse.json(
        { error: "Content or image is required." },
        { status: 400 }
      );
    }
    if (!spaceId) {
      return NextResponse.json(
        { error: "Space ID is required." },
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

    // Get the space to validate membership and fetch the SpaceMember ID
    const space = await db.space.findUnique({
      where: { id: spaceId },
      include: { members: true },
    });

    if (!space) {
      return NextResponse.json({ error: "Space not found." }, { status: 404 });
    }

    // Check if the user is a member of the space
    const spaceMember = space.members.find(
      (member) => member.userId === userId
    );
    if (!spaceMember) {
      return NextResponse.json(
        { error: "User is not a member of this space." },
        { status: 403 }
      );
    }

    // Save the message to the database
    const newMessage = await db.spaceMessage.create({
      data: {
        content,
        image,
        space: {
          connect: { id: spaceId },
        },
        sender: {
          connect: { id: spaceMember.id }, // Link to the SpaceMember record
        },
        isReadList: [userId!],
      },
      include: {
        sender: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // In your space message POST endpoint
    await pusherServer.trigger(spaceId, "messages:new", { newMessage });

    // // When marking messages as read
    // await pusherServer.trigger(`space-${spaceId}`, "message:read", {
    //   messageId: newMessage.id,
    //   userId: userId,
    //   memberInfo: spaceMember,
    // });

    // Return success response
    return NextResponse.json(
      {
        status: "success",
        data: newMessage,
        message: "Message sent successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Internal Server Error.",
        success: "error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
