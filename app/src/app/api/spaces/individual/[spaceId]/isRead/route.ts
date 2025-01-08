import { db } from "@/app/lib/db";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

interface Iparams {
  spaceId: string;
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

  const { spaceId } = await context.params;

  try {
    // Check if the space exists
    const space = await db.space.findUnique({
      where: { id: spaceId },
      include: {
        members: true, // Include members to verify membership
      },
    });

    if (!space) {
      return NextResponse.json(
        { message: "Space not found!", status: "error" },
        { status: 404 }
      );
    }

    // Check if the user is a member of the space
    const spaceMember = space.members.find(
      (member) => member.userId === currentUserId
    );

    if (!spaceMember) {
      return NextResponse.json(
        { message: "You are not a member of this space!", status: "error" },
        { status: 403 }
      );
    }

    // Fetch all unread messages in the space that the current user hasn't read yet
    const unreadMessages = await db.spaceMessage.findMany({
      where: {
        spaceId,
        spaceMemberId: { not: spaceMember.id }, // Exclude messages sent by the current user
        NOT: {
          isReadList: {
            has: currentUserId, // Exclude messages already read by the current user
          },
        },
      },
    });

    // Update each unread message to add the current user's ID to the isReadList array

    for (const message of unreadMessages) {
      // Check if the current user's ID is already in the isReadList
      const isAlreadyRead = message.isReadList.includes(currentUserId!);

      // If the current user hasn't read the message, update the isReadList
      if (!isAlreadyRead) {
        await db.spaceMessage.update({
          where: { id: message.id },
          data: {
            isReadList: {
              push: currentUserId, // Add the current user's ID to the isReadList array
            },
          },
        });
      }
    }

    return NextResponse.json(
      {
        message: "Messages in the space marked as read successfully!",
        status: "success",
      },
      { status: 200 }
    );
  } catch (error: any) {
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
