// /pages/api/dms/detailed/route.ts
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
          some: { id: userId },
        },
      },
      include: {
        messages: {
          take: 1, // Get the most recent message
          orderBy: { createdAt: "desc" },
          select: {
            content: true,
            createdAt: true,
            isRead: true,
            sender: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        },
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

    const detailedDMs = conversations.map((conversation) => ({
      id: conversation.id,
      participants: conversation.participants.filter(
        (user) => user.id !== userId
      ),
      lastMessage: conversation.messages[0] || null,
    }));
    return NextResponse.json(
      {
        status: "success",
        message: "Data retrieved successfully",
        data: detailedDMs,
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
