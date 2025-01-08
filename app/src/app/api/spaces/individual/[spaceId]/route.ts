import { db } from "@/app/lib/db";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
interface Iparams {
  spaceId: string;
}
export async function GET(req: Request, context: { params: Promise<Iparams> }) {
  console.log("in get function");
  const token = await getToken({ req: req, secret: process.env.AUTH_SECRET });
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized!", status: "error" },
      { status: 401 }
    );
  }

  const currentUserId = token?.sub;
  const { spaceId } = await context.params;
  console.log(spaceId);
  if (!spaceId) {
    return NextResponse.json(
      { message: "Missing 'id' parameter", status: "error" },
      { status: 400 }
    );
  }

  try {
    // Fetch the space by ID
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
        messages: {
          orderBy: { createdAt: "asc" }, // Messages in chronological order
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
        },
      },
    });

    if (!space) {
      return NextResponse.json(
        { message: "Space not found", status: "error" },
        { status: 404 }
      );
    }
    const isParticipant = space.members.some(
      (participant) => participant.user.id === currentUserId
    );
    if (!isParticipant) {
      return NextResponse.json(
        { message: "Access denied", status: "error" },
        { status: 403 }
      );
    }

    const resolveReadByUsers = (message: any, members: any) => {
      return message.isReadList.map((userId: string) => {
        const member = members.find((m: any) => m.user.id === userId);
        return member ? member : null;
      });
    };

    // Add resolved "readBy" data to each message
    const messagesWithReadBy = space.messages.map((message) => ({
      ...message,
      readBy: resolveReadByUsers(message, space.members),
    }));

    const spaceWithReadBy = { ...space, messages: messagesWithReadBy };

    return NextResponse.json(
      {
        status: "success",
        message: "Space retrieved successfully",
        data: {
          spaceWithReadBy,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch Space",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
