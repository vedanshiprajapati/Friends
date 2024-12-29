import { db } from "@/app/lib/db";
import { NextApiResponse } from "next";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req: Request, res: NextApiResponse) {
  const token = await getToken({ req: req, secret: process.env.AUTH_SECRET });
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized!", status: "error" },
      { status: 401 }
    );
  }

  const userId = token?.sub;

  try {
    const conversations = await db.conversation.findMany({
      where: {
        participants: {
          some: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
        participants: {
          select: {
            id: true,
            name: true,
            username: true,
            image: true,
          },
        },
        messages: {
          take: 1, // Fetch the latest message
          orderBy: {
            createdAt: "desc",
          },
          select: {
            content: true,
            createdAt: true,
          },
        },
      },
    });

    const minimalDMs = conversations.map((conversation) => {
      // Determine the other user in the conversation
      const otherUser = conversation.participants.find(
        (participant) => participant.id !== userId
      );

      return {
        id: conversation.id,
        user: otherUser,
        // latestMessage: conversation.messages[0] || null, // Latest message if available
      };
    });

    return NextResponse.json(
      {
        status: "success",
        message: "Data retrieved successfully",
        data: minimalDMs,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to retrieve data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
